import { readFile } from 'fs/promises';
const deploymentHistory = JSON.parse(
  await readFile(
    new URL('./deploymentHistories.json', import.meta.url)
  )
);
import moment from 'moment/moment.js';

// Find the 10 subdomains with the most updates

// console.log({deploymentHistory})

const topTenSubdomains= ()=>{
    console.log(deploymentHistory.length)
    let seenSubdomain={}
    for(let history of deploymentHistory){
        if(history.subdomain){
            if(history.subdomain in seenSubdomain){
                seenSubdomain[history.subdomain]++
            }else{
                seenSubdomain[history.subdomain]=1
            }
        }
    }

    let subdomainEntries =Object.entries(seenSubdomain)
    let totalSubdomains =subdomainEntries.length
    let subDomainWithOneUpdate =0
    subdomainEntries.forEach(([_,occurence])=>{
        if(occurence==1)subDomainWithOneUpdate++
    })
    subdomainEntries.sort((a,b)=>a[1]-b[1]).reverse()
    let percentageOfSubDomainsWithOne=((subDomainWithOneUpdate/totalSubdomains)*100).toFixed(0)
    console.log(subDomainWithOneUpdate,totalSubdomains)
    console.log(`percentage Of SubDomains With One is ${percentageOfSubDomainsWithOne}%`)
    console.log( subdomainEntries.slice(0,10))
    
}

const weeklyUpdates=()=>{
    deploymentHistory.sort((a,b)=>{
        const date1 = moment(a.createdAt.$date);
        const date2 = moment(b.createdAt.$date);
        if(date1.isAfter(date2))return 1
        else return -1
    })

    let result =[]

    let firstDate =0
    let currentDate=1
    let currentUpdateCount=0
   while(currentDate<deploymentHistory.length&&firstDate<deploymentHistory.length){
     let dateOne = moment(deploymentHistory[firstDate].createdAt.$date);
     let dateTwo = moment(deploymentHistory[currentDate].createdAt.$date);
     let difference = dateTwo.diff(dateOne, 'days') 
     if(difference<=7){
        currentUpdateCount++
     }else{
        result.push(currentUpdateCount)
        currentUpdateCount=0
        firstDate=currentDate
     }
     currentDate++
   }
   if(currentUpdateCount!==0) result.push(currentUpdateCount)
   console.log(result)
   let asciiResult=''
   result.map((count,idx)=>{
    let hashes =Array((Math.round(count/100))).fill('#').join('')
    asciiResult+=`week ${idx+1} :${hashes}\n`
   })
   console.log(asciiResult) 
}
// topTenSubdomains()
weeklyUpdates()

