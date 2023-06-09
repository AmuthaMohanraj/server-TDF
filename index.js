const express=require('express');
const mysql=require('mysql');
const app=express();
const port=3000;
const cors=require('cors');
app.use(cors());
app.use(express.json());

// create connection
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'myroot99club',
    database:'studentInfo'
});

// set up routes
app.get('/',(req,res)=>{
    res.send('Hello World!');
});

// get all students
app.get('/studentsList',(req,res)=>{
    const sql=`SELECT s.id,s.name,s.age,g.gender,s.email,s.phone,u.university,m.major
    FROM studentTable s
    JOIN genderTable g ON s.genderId = g.id
    JOIN universitesTable u ON s.universityId = u.id
    JOIN majorTable m ON s.majorId = m.id where isActive=1;`;
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});

// get student by id
app.get('/studentById/:id',(req,res)=>{
    const sql=`SELECT id,name,age,genderId,email,phone,universityId,majorId FROM studentTable WHERE id=?`;
    connection.query(sql,[req.params.id],(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result?.[0]);
    });
});

// post student using body method   
app.post('/addStudent',(req,res)=>{
    let skillsArr=req.body.skills;    
    console.log(skillsArr);
    const sql=`insert into studentTable(name,age,genderId,email,phone,universityId,majorId,isActive) values(?,?,?,?,?,?,?,?)`;
    connection.query(sql,[req.body.name,req.body.age,req.body.genderId,req.body.email,req.body.phone,req.body.universityId,req.body.majorId,1],(err,result)=>{
        if(err) throw err;
        console.log(result);
        id=result.insertId;
        if(skillsArr.length>0){
            const rowData = skillsArr.map((skill) => [id,skill]);
            console.log("Skills",rowData);
            connection.query(`insert into studentSkillsMapping(studentId,skillId) values ?`,[rowData],(err,result)=>{
                if(err) throw err ;
                console.log(result);
            });
            res.send(result);
        }else{
            console.log('no skills');
            res.send(false);
        }
        
    });
});

// update student
app.put('/updateStudent',(req,res)=>{
    const sql=`update studentTable set name=?,age=?,genderId=?,email=?,phone=?,universityId=?,majorId=? where id=?`;
    connection.query(sql,[req.body.name,req.body.age,req.body.genderId,req.body.email,req.body.phone,req.body.universityId,req.body.majorId,req.body.id],(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});

// soft delete using put method  change isActive to 0 set id value using sequel injection
app.put('/deleteStudent',(req,res)=>{
    const sql=`UPDATE studentTable SET isActive=0 WHERE id=?`;
    connection.query(sql,[req.body.id],(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});

// get master table data gender
//gender
app.get('/genderData',(req,res)=>{
    const sql=`select id,gender from genderTable`;
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
})

//university
app.get('/universityData',(req,res)=>{
    const sql=`select id,university from universitesTable`;
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
})

//major
app.get('/majorData',(req,res)=>{
    const sql=`select id,major from majorTable`;
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
})

// skills table
app.get('/skillData',(req,res)=>{
    const sql=`select id,skill from skillsTable`;
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});

//listen to port 
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
});

// connect to mysql server
connection.connect((err)=>{
    if(err) return;
    console.log('Connected to MySQL Server!');
});
