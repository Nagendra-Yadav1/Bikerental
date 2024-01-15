// const obj= {
//     password: passowner,
//     bikes: {
//         Normal: {

//         },
//         Super: {

//         },
//         Scooty: {

//         }
//     },
//     cars: {
//         Normal: {

//         },
//         Super: {

//         }
//     },
//     bikes_price:{
//         Normal_bike:{

//         },
//         Super_bike:{

//         },
//         Scooty_bike:{

//         }
//     }
// };


// const owners = {
//     "mohit22@navgurukul.org": {
//         Password: "Na82997@"
//     }
// }

// m=Object.keys(owners)
// console.log(m)




// const obj = {
//     "password": "Na82997@",
//     "bikes": {
//         "Normal": {
//             "Splender": 30,
//             "Bajaj": 110,
//             "Hero Hando": 120,
//             "Super Splender": 130,
//             "Tvs": 50
//         },
//         "Super": {
//             "Bullet": 400,
//             "KTM": 450,
//             "Apachi": 500,
//             "Pulser": 550,
//             "Avenger": 600
//         },
//         "Scooty": {
//             "Tvs Scooty": 200,
//             "ELectric Scooty": 220,
//             "Honda Scooty": 460,
//             "Activa Scooty": 300,
//             "Hero Scooty": 240
//         }
//     },
//     "cars": {
//         "Normal": {
//             "Maruti Suzuki": 1000,
//             "Toyota Etios": 1100,
//             "Honda City": 1200,
//             "Verna": 1300,
//             "Tata Indigo": 1400
//         },
//         "Super": {
//             "Mercedes": 3000,
//             "BMW": 3500,
//             "Audi A4": 4000,
//             "Mahindra Thar": 4500,
//             "Tata Safari": 5000
//         }
//     }
// }

// for (const category in obj) {
//     if (obj.hasOwnProperty(category) && typeof obj[category] === 'object') {
//         for (const subCategory in obj[category]) {
//             if (obj[category][subCategory].hasOwnProperty("Splender")) {
//                 const splenderQuantity = obj[category][subCategory]["Splender"];
//                 console.log(`Splender quantity in ${category}.${subCategory}: ${splenderQuantity}`);
//             }
//         }
//     }
// }

// let file=require("fs");
// const obj={
//     name:"nage",
//     age:19,
//     class:"12th"
// }

// const load_data="Load.json"
// const k=JSON.stringify(obj,null,4);
// file.writeFileSync(load_data,k)



// const s=file.readFileSync(load_data)
// const m=JSON.parse(s,"utf8");
// console.log(m)





















