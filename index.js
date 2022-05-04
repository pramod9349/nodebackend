const express = require('express')
const fileUpload = require('express-fileupload');
const cors = require('cors')
const reader = require('xlsx')
const app = express()
const port = 4500
const fs = require('fs');

app.use(express.static('public'))
app.use(cors())
app.use(fileUpload());



function diff_years(dt2, dt1) 
 {
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
   diff /= (60 * 60 * 24);
  return Math.abs(Math.round(diff/365.25)); 
 }
    function writeresult(file){
    return(Promise.resolve(reader.writeFile(file,`./public/PatentRanking.xlsx`)))
 }


 function hmlfunction(max,checkval){
     console.log("in the last function ")
     console.log(max)
     console.log(checkval)
     console.log("end of last value")

     if (checkval>=(max*80)/100){
         console.log("in the range of 80 %")
         return "HIGH"
     }else if(checkval>=(max*40)/100 && checkval<(max*80)/100){

        console.log("in the range of 40%-80%")
        return "MEDIUM"
     }else if(checkval<(max*40)/100){
         console.log("in the range of below 40%")
         return "LOW"
     }
    

 }


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getdata', (req, res) => {
    res.send('Hello World!')
  })



app.post('/upload', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }

    var folder = './public/';
   
// fs.readdir(folder, (err, files) => {
//   if (err) throw err;
  
//   for (const file of files) {
//       console.log(file + ' : File Deleted Successfully.');
//       fs.unlinkSync(folder+file);
//   }
  
// });

    const Family_Legal_StatusDeadAlive_server=(req.body.Family_Legal_StatusDeadAlive_Counter)
    const SimpleFamilyMembers_Counter_server=(req.body.SimpleFamilyMembers_Counter)
    const Legal_Status_DeadAlive_Counter_server=(req.body.Legal_Status_DeadAlive_Counter)
    const PriorityCountryCode_Counter_server=(req.body.PriorityCountryCode_Counter)
    const Legal_Status_Current_Counter_server=(req.body.Legal_Status_Current_Counter)
    const Is_Litigated_Counter_server=(req.body.Is_Litigated_Counter)
    const FilingApplicationDate_Counter_server=(req.body.FilingApplicationDate_Counter)
    const First_Claim_Counter_server=(req.body.First_Claim_Counter)
    const NumbersOfIndependentClaims_Counter_server=(req.body.NumbersOfIndependentClaims_Counter)
    const ForwardCitationsIndividual_Counter_server=(req.body.ForwardCitationsIndividual_Counter)
    const Is_Opposed_Counter_server=(req.body.Is_Opposed_Counter)
    const EstimatedExpiryDate_Counter_server=(req.body.EstimatedExpiryDate_Counter)
    const Litigation_counter_server=(req.body.Litigation_counter)

    //console.log(`this is litigation value from front end ${Litigation_counter_server} `)



    // console.log(Family_Legal_StatusDeadAlive_server,SimpleFamilyMembers_Counter_server,Legal_Status_DeadAlive_Counter_server
    //     ,PriorityCountryCode_Counter_server,Legal_Status_Current_Counter_server,Is_Litigated_Counter_server,FilingApplicationDate_Counter_server
    //     ,First_Claim_Counter_server,NumbersOfIndependentClaims_Counter_server,ForwardCitationsIndividual_Counter_server
    //     ,Is_Opposed_Counter_server,EstimatedExpiryDate_Counter_server,Litigation_counter_server)


//console.log("request is")
//console.log(req)

    const myFile = req.files.file;
    thisfilename = "clientupload.xlsx";
    
//    myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
    myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
    if (err) {
        console.log(err)
        return res.status(700).send({ msg: "Error hai" });
    }

    console.log("in server me")
    const file = reader.readFile(`./public/${myFile.name}`,{type:'binary',cellText:false,cellDates:true})

    //const file = reader.readFile(myFile)

    let data = []

    let outputdata = []
    let allavgValue=[]
    const sheets = file.SheetNames

    for(let i = 0; i < sheets.length; i++)
    {
        const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]],{raw:false},{defval:""})
        data = JSON.stringify(temp,undefined,4)
        countres = 0
        temp.forEach((res) => {
            console.log(res)
            countres = countres + 1
        console.log(res["Record Number"]);
        
        let patenNumber= res["Record Number"];
        let Legal_Status_Current= res["Legal Status Current"];            
        let Is_Litigated=(res["Is Litigated"]);     //this value is for both litigation and family memeber litigation
        let Is_Opposed=(res["Is Opposed"]);
        let Legal_Status_DeadAlive=(res["Legal Status (Dead/Alive)"]);
        let Family_Legal_StatusDeadAlive=(res["Family Legal Status(Dead/Alive)"]);
        let ForwardCitationsIndividual=(res["No. of Forward Citations (Individual)"]);
        let PriorityCountryCode=(res["Priority Country Code"]);
        let EstimatedExpiryDate=(res["Estimated Expiry Date"]);
        let First_Claim=  (res["First Claim"]);
        let NumbersOfIndependentClaims =(res["No. of Independent Claims"]);
        let SimpleFamilyMembers =(res["Simple Family Members"]);
        let FilingApplicationDate=(res["Filing/Application Date"]); 
        let PublicationIssueDate=(res["Publication/Issue Date"]);
        
      
        // console.log("Legal status******************************")
        // console.log(patenNumber)
        // console.log(Legal_Status_Current);
        // console.log("Legal status******************************")

        Legal_Status_Current_Counter=0
        Is_Opposed_Counter=0
        Legal_Status_DeadAlive_Counter=0
        Family_Legal_StatusDeadAlive_Counter=0
        ForwardCitationsIndividual_Counter=0
        PriorityCountryCode_Counter=0
        Is_Litigated_Counter=0
        EstimatedExpiryDate_Counter=0
        First_Claim_Counter=0
        NumbersOfIndependentClaims_Counter=0
        SimpleFamilyMembers_Counter=0
        FilingApplicationDate_Counter=0
        Litigation_counter=0
        
        //for Legal Status Current
        if (Legal_Status_Current != undefined){                
            if((Legal_Status_Current).toLowerCase().includes("granted"))
            {
                Legal_Status_Current_Counter = 2
                console.log("patent is granted")
            }
            else if((Legal_Status_Current).toLowerCase().includes("published"))             {
                Legal_Status_Current_Counter = 1
                console.log("patent is published")
            }               
        }else{
            Legal_Status_Current=0;    //if value is not found
        }

        //for islitigation

        if (Is_Litigated != undefined){                
            if((Is_Litigated).toLowerCase().includes("no"))
            {
                Is_Litigated_Counter = 0
                console.log("patent is not litigated")
            }
            else if((Is_Litigated).toLowerCase().includes("yes"))             {
                Is_Litigated_Counter = 1
                console.log("patent is litigated")
            }               
        }else{
            console.log("litigation is not present")
            Is_Litigated_Counter=0;
        }

        //for is opposed 

        if (Is_Opposed != undefined){                
            if((Is_Opposed).toLowerCase().includes("no"))
            {
                Is_Opposed_Counter = 0
                console.log("no opposed")
            }
            else if((Is_Opposed).toLowerCase().includes("yes"))             {
                Is_Opposed_Counter = 1
                console.log("yes opposed")
            }               
        }else{
            console.log("opposition is not found")
            Is_Opposed_Counter=0;
        }

        //for legalStatus Dead or alive

        if (Legal_Status_DeadAlive != undefined){                
            if((Legal_Status_DeadAlive).toLowerCase().includes("alive"))
            {
                Legal_Status_DeadAlive_Counter = 1
                console.log("legal status alive")
            }
            else if((Legal_Status_DeadAlive).toLowerCase().includes("dead"))             {
                Legal_Status_DeadAlive_Counter = 0
                console.log("legal status dead")
            }               
        }else{
            console.log("legal status is not present.......... ")
            Legal_Status_DeadAlive_Counter=0
        }


        //for family legal status

        if (Family_Legal_StatusDeadAlive != undefined){                
            if((Family_Legal_StatusDeadAlive).toLowerCase().includes("alive"))
            {
                Family_Legal_StatusDeadAlive_Counter = 1
                console.log("family legal status alive")
            }
            else if((Family_Legal_StatusDeadAlive).toLowerCase().includes("dead"))             {
                Family_Legal_StatusDeadAlive_Counter = 0
                console.log("family legal status dead")
            }               
        }else{
            console.log("family legal status is not present........")
            Family_Legal_StatusDeadAlive_Counter=0;
        }
        
        //for forward citation individual

        if (ForwardCitationsIndividual != undefined){    
            ForwardCitationsIndividual= Number(ForwardCitationsIndividual);
            ForwardCitationsIndividual_Counter=ForwardCitationsIndividual
            
        }else{
            console.log("forward citation is missing")
            ForwardCitationsIndividual_Counter=0;
        }

        //console.log(`checking type ${typeof(Number(ForwardCitationsIndividual))}*******************88888///////////////`)


        //for priorityCountyCode 
        if (PriorityCountryCode != undefined){                
            if((PriorityCountryCode).toLowerCase().includes("us")){
                PriorityCountryCode_Counter = 3
                console.log("country code is us")
            }else if((PriorityCountryCode).toLowerCase().includes("ep")){
                PriorityCountryCode_Counter = 2
                console.log("country code is ep")

            }else if((PriorityCountryCode).toLowerCase().includes("cn")){
                PriorityCountryCode_Counter = 2
                console.log("forwardcitation status cn")    
            }else{
                PriorityCountryCode_Counter = 0
                console.log("forwardcitation status other") 
            }
        }else{
            console.log("no priority country is present")
            PriorityCountryCode_Counter=0;
        }

        
        //for EstimateExpiray Date
       //need to be done by shivanshu****************************************
        if (EstimatedExpiryDate != undefined){     
             
            thisdate=new Date();
            let todaydateis=thisdate.getFullYear()+'/'+(thisdate.getMonth()+1)+'/'+thisdate.getDate();
            todaydateis=new Date(todaydateis);
            EstimatedExpiryDate =new Date(EstimatedExpiryDate);
            //console.log(`this is today date${todaydateis}`)
            //console.log(`this is estimated date  ${EstimatedExpiryDate}*******************************`);
            console.log(`this is date difference in year ${diff_years(EstimatedExpiryDate,todaydateis)}`);
            const yeardifference=diff_years(EstimatedExpiryDate,todaydateis)
            EstimatedExpiryDate_Counter=yeardifference
        }else{
            console.log("Estimate date is not present ......")
            EstimatedExpiryDate_Counter=0;
        }
        
        
 
        //for first claim 

        if (First_Claim != undefined){     
            
            let claimlen = First_Claim.length
            First_Claim_Counter=claimlen
            
        }else{

            console.log("first claim is not present")
            First_Claim_Counter=0;
        }
        console.log(`this is claim ${First_Claim_Counter}for claim`)


        //for no. of independenet claims

        if (NumbersOfIndependentClaims != undefined){                
            
                NumbersOfIndependentClaims_Counter=NumbersOfIndependentClaims;
            
        }else{
            console.log("indipendent no is not present")
            NumbersOfIndependentClaims_Counter=0;
        }

        
        //for simple family members

        var arrcountry = [];
        var chekcounter=0;
        if (SimpleFamilyMembers != undefined){   
            if (SimpleFamilyMembers.search("/")){
                console.log("in if condition")
                chekcounter=1;
                SimpleFamilyMembers=SimpleFamilyMembers.replace(/\r?\n|\r/g, "/")
                var str_array = SimpleFamilyMembers.split('/');
                for(var i = 0; i < str_array.length; i++) {
                    // Trim the excess whitespace.
                    str_array[i]=str_array[i].trim();
                    // Add additional code here, such as:
                    console.log(i)
                    console.log(str_array[i]+"==> "+str_array[i].substring(0, 2));
                    arrcountry.push(str_array[i].substring(0, 2));
                }
            }
            

        }

        if (chekcounter===1){

            console.log("print value in array")
            console.log(arrcountry);
            uniq = [...new Set(arrcountry)];
            console.log(uniq)
            SimpleFamilyMembers_Counter=((uniq).length);
            console.log(`this is last array value ${SimpleFamilyMembers_Counter}`)
    
        }else if(SimpleFamilyMembers != undefined){
            SimpleFamilyMembers_Counter=1;   //if  records present 

        }else{
            console.log("if simple member is not present")
            SimpleFamilyMembers_Counter=0;
        }

        //for (filling /application date)
        if (FilingApplicationDate != undefined && PublicationIssueDate!==undefined){
            
            console.log("yes in handle undefined  get the value!!!!!!")

            console.log(FilingApplicationDate,PublicationIssueDate)

            FilingApplicationDate = new Date(FilingApplicationDate)
            PublicationIssueDate = new Date(PublicationIssueDate)
            const diffTime = Math.abs(PublicationIssueDate - FilingApplicationDate);
            const diffmonth = Math.ceil((diffTime / (1000 * 60 * 60 * 24))/30); 
            console.log(diffmonth + " month  ");
            FilingApplicationDate_Counter=diffmonth;
            console.log(`publication counter is ${FilingApplicationDate_Counter} and type is---${typeof(FilingApplicationDate_Counter)} ` )
         }else{
             console.log("in date is not present")
            FilingApplicationDate_Counter=0;
         }

         //Calculating total weightage for each patent
         let maxvalue=[]

         const t1= Number(Family_Legal_StatusDeadAlive_server*Family_Legal_StatusDeadAlive_Counter)/100
         const t2= Number(SimpleFamilyMembers_Counter_server*SimpleFamilyMembers_Counter)/100
         const t3= Number(Legal_Status_DeadAlive_Counter_server*Legal_Status_DeadAlive_Counter)/100
         const t4= Number(PriorityCountryCode_Counter_server*PriorityCountryCode_Counter)/100
         const t5= Number(Legal_Status_Current_Counter_server*Legal_Status_Current_Counter)/100
         const t6= Number(Is_Litigated_Counter_server*Is_Litigated_Counter)/100
         const t7= Number(FilingApplicationDate_Counter_server*FilingApplicationDate_Counter)/100
         const t8= Number(First_Claim_Counter_server*First_Claim_Counter)/100
         const t9= Number(NumbersOfIndependentClaims_Counter_server*NumbersOfIndependentClaims_Counter)/100
         const t10= Number(ForwardCitationsIndividual_Counter_server*ForwardCitationsIndividual_Counter)/100
         const t11= Number(Is_Opposed_Counter_server*Is_Opposed_Counter)/100
         const t12= Number(EstimatedExpiryDate_Counter_server*EstimatedExpiryDate_Counter)/100
         const t13= Number(Litigation_counter_server*Is_Litigated_Counter)/100   //value is same for familiy litigation
         console.log("this is starting of avg value")
         console.log("this is largest value")
         var arr = [t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12,t13];
        //  var max = Math.max(arr);
        //  var max = arr.reduce(function(a, b) {
        //     return Math.max(a, b);
        // }, -Infinity);
        // console.log(t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12,t13)
        //  console.log(`this is maximum value for the ${max}`)
         const sumofAllavg=(t1+t2+t3+t4+t5+t6+t7+t8+t9+t10+t11+t12+t13)
         let hightestval= 0
         let tempval=0
         if  (tempval>sumofAllavg){
            hightestval=tempval
         }else{
            hightestval=sumofAllavg
         }

         console.log(sumofAllavg)
         console.log("end of avg value")
         allavgValue.push(sumofAllavg)

         outputrow = {

             "Patent No": patenNumber,
            //  "Legal_Status_Current_Counter": Legal_Status_Current_Counter,
            //  "Is_Opposed_Counter": Is_Opposed_Counter,
            //  "Legal_Status_DeadAlive_Counter": Legal_Status_DeadAlive_Counter,
            //  "Family_Legal_StatusDeadAlive_Counter": Family_Legal_StatusDeadAlive_Counter,
            //  "ForwardCitationsIndividual_Counter": ForwardCitationsIndividual_Counter,
            //  "PriorityCountryCode_Counter": PriorityCountryCode_Counter,
            //  "Is_Litigated_Counter": Is_Litigated_Counter,
            //  "EstimatedExpiryDate_Counter": EstimatedExpiryDate_Counter,
            //  "First_Claim_Counter": First_Claim_Counter,
            //  "NumbersOfIndependentClaims_Counter": NumbersOfIndependentClaims_Counter,
            //  "SimpleFamilyMembers_Counter": SimpleFamilyMembers_Counter,
            //  "Litigation_counter":Is_Litigated_Counter,
            //  "FilingApplicationDate_Counter":FilingApplicationDate_Counter,
           
             "Average Weightage":sumofAllavg,
            //  "Automated Ranking":"N/A"
         }

         console.log("this is highestval..................")
         console.log(hightestval)
         console.log("end of highestval...................")

         outputdata.push(outputrow)
         //"FilingApplicationDate_Counter": FilingApplicationDate_Counter,   
    //}
         })
    }

     ///condition added for HML append all avg in list 

     if (countres<2){
        return res.status(500).send({ msg: "file is empty" })
     }
    


            console.log(allavgValue)
                var max = Math.max(allavgValue);
                        var max = allavgValue.reduce(function(a, b) {
                            return Math.max(a, b);
                        }, -Infinity);
                console.log(max)
                //loop all avgvalue 
                for(var i = 0; i < allavgValue.length; i++){
                    let finalstatus= hmlfunction(max,allavgValue[i]);
                    console.log(finalstatus)
                    console.log(typeof(finalstatus))
                    console.log(`${finalstatus} ===> for ${allavgValue[i]}`)
                         }
                

           // console.log(outputdata)
        //end of writing the data to sheet

        for(z=0; z<outputdata.length; z++)
        {
            
            console.log("this row object starts")
            console.log(outputdata[z]["Patent No"])
            thispatentscore = outputdata[z]["Average Weightage"]
            let finalstatus= hmlfunction(max,thispatentscore);
            outputdata[z]["Final Status"] = finalstatus
            console.log(outputdata[z])
            console.log("this row object ends")
        }
 console.log("outside for now")
    const ws = reader.utils.json_to_sheet(outputdata)
    reader.utils.book_append_sheet(file,ws,"Ranking Result")
  
// Writing to our file
 //   reader.writeFile(file,`./public/PatentRanking.xlsx`)
 writeresult(file).then(function () {
        // done
        //res.send(200);
        console.log('written file');
        console.log("I am at last")

        // res.setHeader(
        //     "Content-Type",
        //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        //   );
        //   res.setHeader(
        //     "Content-Disposition",
        //     "attachment; filename=" + "tutorials.xlsx"
            
        //   );

         
          
        // res.download(`${__dirname}/public/PatentRanking.xlsx`);
        console.log("output data is")
        console.log(outputdata)

        res.send(outputdata);
       
      });

     

    // const mypromise = new Promise(function(resolve, reject) {

    //     reader.writeFile(file,`./public/PatentRanking.xlsx`, function(err) {
    //         if (err) reject(err);
    //         else resolve(data);
    //     }).then(function(results) {          
            
    //    })
    // });

    //res.download(`./public/PatentRanking.xlsx`)
    
    // Printing data
    // console.log("data is")
    // console.log(data)


    // return outputdata;


    //return res.send({ file: myFile.name, path: `/${myFile.name}`, ty: myFile.type });

});


  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})