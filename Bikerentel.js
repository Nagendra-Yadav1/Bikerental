const input = require("readline-sync");
const fs = require("fs");
console.log("Welcome TO Bike Rent");
let validadtion_email = {}
let validation_password = {}
let validation_Phonenumber = {}
let name_validation = {}
let main_data = {}
let main_rent = {}
const file_main = "main_data.json";
const file_rent = "rent_data.json";
const main_list = [];
const Owner_file = "owner_data.json"
let ownersData = {};
let PricesData = {}
const Prices_file = "Prices_data.json"
const owners = {
    "mohit22@navgurukul.org": {
        Password: "Na82997@"
    }
}


function name() {
    while (true) {
        let Name = input.question("Enter Your Name:->");
        if (Name.length >= 1) {
            name_validation["Name"] = Name;
            break
        }
        else {
            console.log("Your name is empty")

        }

    }
}


function valid_Phonenumber() {
    while (true) {
        let Phonenumber = input.question("Enter Your Phonenumber:->");
        if (Phonenumber.length === 10) {
            if (
                "0123456789".split('').some(digit => Phonenumber.includes(digit))
            ) {
                validation_Phonenumber["Phonenumber"] = Phonenumber;
                break;
            } else {
                console.log("Phone number is not valid");
            }
        } else {
            console.log("Your Phone number digit is not enough");
        }
    }
}


function valid_password() {
    while (true) {
        let Password = input.question("Enter Your Password:->");
        if (
            Password.split('').some(char => char.toUpperCase() !== char.toLowerCase()) &&
            Password.split('').some(char => char.toUpperCase() === char) &&
            Password.split('').some(char => char.toLowerCase() === char) &&
            Password.split('').some(char => !isNaN(char)) &&
            Password.split('').some(char => "~!@#$%^&*_".includes(char))
        ) {
            validation_password["Password"] = Password;
            break;
        } else {
            console.log("Your password is not correct");
        }
    }
}


function validateEmail() {
    while (true) {
        let email = input.question("Enter Your Email:->");
        let flag = 0;
        let flag1 = 0;
        let flag2 = 0;
        if (email.length >= 6) {
            if (email[0].match(/[a-zA-Z]/)) {
                if (email.includes('@') && email.split('@').length === 2) {
                    const lastPart = email.split('@')[1];
                    const dotIndex = lastPart.lastIndexOf('.');
                    if (dotIndex !== -1 && lastPart.slice(dotIndex + 1).length > 0) {
                        for (let i of email) {
                            if (i === ' ') {
                                flag = 1;
                            } else if (i.match(/[a-zA-Z]/)) {
                                if (i === i.toUpperCase()) {
                                    flag1 = 1;
                                }
                            } else if (!isNaN(i)) {
                                continue;
                            } else if (['_', '.', '@'].includes(i)) {
                                continue;
                            } else {
                                flag2 = 1;
                            }
                        }

                        if (flag === 1) {
                            console.log("Space is present in your email.");
                        } else if (flag1 === 1) {
                            email.toLowerCase()
                            console.log("Uppercase letters are present in your email.");
                        } else if (flag2 === 1) {
                            console.log("Wrong characters present in your email.");
                        } else {
                            validadtion_email["email"] = email;
                            break;
                        }
                    } else {
                        console.log("Dot (.) is not present in the last part of your email.");
                    }
                } else {
                    console.log("Not present '@' in your email.");
                }
            } else {
                console.log("Your first letter is not an alphabet.");
            }
        } else {
            console.log("Wrong email length is less.");
        }
    }
}


function restore_vehicle_quantity(type, quantity, ownerdata) {
    for (const category in ownerdata) {
        if (ownerdata.hasOwnProperty(category) && typeof ownerdata[category] === 'object') {
            for (const subCategory in ownerdata[category]) {
                if (ownerdata[category][subCategory].hasOwnProperty(type)) {
                    if (category === "bikes") {
                        addBike(subCategory, type, quantity)
                    }
                    else {
                        addCar(subCategory, type, quantity)
                    }
                }
            }
        }
    }
}




function display_rent_data_email_data(rent_email) {
    let type = Object.keys(rent_email)[0]
    let quantity = Object.values(rent_email)[0];
    const ownerEmail = Object.keys(owners);
    const ownerdata = findOwnerData(ownerEmail);
    restore_vehicle_quantity(type, quantity, ownerdata)
}


function deleteRentData(userEmail) {
    if (main_rent[userEmail]) {
        let rent_email = main_rent[userEmail]
        display_rent_data_email_data(rent_email)
        delete main_rent[userEmail];
        const rentData = JSON.stringify(main_rent, null, 4);
        fs.writeFileSync(file_rent, rentData);
    } else {
        console.log(`Rent data's ${userEmail} not found`);
    }
}



function addUser(userEmail, account, Phonenumber) {
    if (!main_data[userEmail]) {
        const isPhoneNumberTaken = Object.values(main_data).some(
            existingAccount => existingAccount.Phonenumber === Phonenumber
        );

        if (!isPhoneNumberTaken) {
            main_data[userEmail] = { ...account, Phonenumber };
            const fileData = JSON.stringify(main_data, null, 4);

            fs.writeFileSync(file_main, fileData);

            console.log(`User account signup successfully`);
        } else {
            console.log(`Phone number is already associated with another account`);
        }
    } else {
        console.log(`User account already exists`);
    }
}



function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

function addPrice(bikeprice, userEmail) {
    if (!main_rent[userEmail]) {
        main_rent[userEmail] = bikeprice;
        const rent_data = JSON.stringify(main_rent, null, 4);
        fs.writeFileSync(file_rent, rent_data);
    } else {
        const newUserId = generateUniqueId();
        const newUserEmail = `${userEmail}-${newUserId}`;

        main_rent[newUserEmail] = bikeprice;
        const rent_data = JSON.stringify(main_rent, null, 4);
        fs.writeFileSync(file_rent, rent_data);
    }
}



function Payamount(balance) {
    while (true) {
        let PayBalane = input.question("Pay for the rent :->");
        if (PayBalane > 0 && PayBalane == balance) {
            console.log("Thanks for paying the rent");
            break
        }
        else if (PayBalane > 0 && PayBalane > balance) {
            console.log(`Your remaining balance is ${PayBalane - balance}`);
            break;
        }
        else if (PayBalane > 0 && PayBalane < balance) {
            console.log(`pay rest of money ${balance - PayBalane}`);
            let remaining_amount = balance - PayBalane
            while (true) {
                let payamount = input.question("Pay for the remaining rent:->");
                if (payamount > 0 && payamount == remaining_amount) {
                    console.log("Thanks for paying remaining rent");
                    break;
                }
                else if (payamount > 0 && payamount > remaining_amount) {
                    console.log(`Your remaining balance is ${payamount - remaining_amount}`)
                    break;
                }
                else if (payamount > 0 && payamount < remaining_amount) {
                    console.log("Pay complete money");
                }
                else {
                    console.log("Please give me positive amount ")
                }
            }
            break;
        }
        else {
            console.log("Please give me positive amount");
        }
    }
}


function Pay_Amount_all(days, price, bike, chooseemail) {
    if (main_list.length == 1) {
        const balance = bike * days * price;
        console.log(`Your total rent balance is :->$${balance}`);
        let User1Email = main_list[0]
        main_list.splice(0, main_list.length);
        let Emails = main_rent[User1Email];
        const keys = Object.keys(Emails);
        for (let bike1 of keys) {
            console.log(`You spent on ${bike1} for ${days} days`);
            console.log(`You had ${bike}  ${bike1}  for rent`);
            console.log(`One ${bike1} rent :-> ${price}`);
            break;
        }
        Payamount(balance);
        deleteRentData(User1Email);
    }
    else {
        const balance = bike * days * price;
        console.log(`Your total rent balance is :->$${balance}`);
        let Emails = main_rent[chooseemail]
        const keys = Object.keys(Emails);
        main_list.splice(0, main_list.length);
        for (let bike1 of keys) {
            console.log(`You spent on ${bike1} for ${days} days`);
            console.log(`You had ${bike}  ${bike1}  for rent`);
            console.log(`One ${bike1} rent :-> ${price}`);
            break;
        }
        Payamount(balance);
        deleteRentData(chooseemail);
    }

}




function bikerent(bike, price, Past_year, Past_month, Past_date, main_month_day, chooseemail) {
    let main_date = new Date()
    let Year = main_date.getFullYear();
    let Month = main_date.getMonth() + 1;
    let date3 = main_date.getDate();
    let Present_month_days = main_month_day[Past_month];
    if (Year == Past_year) {
        if (Month == Past_month) {
            if (Past_date == date3) {
                let days = 1;
                Pay_Amount_all(days, price, bike, chooseemail);
            }
            else {
                let days = date3 - Past_date;
                Pay_Amount_all(days, price, bike, chooseemail);
            }
        }
        else {
            let remaining_Past_month_day = Present_month_days - Past_date;
            let start = Past_month + 1
            let stop = Month;
            let count_day = 0
            while (start < stop) {
                count_day += main_month_day[start]
                start += 1
            }
            let total_days = remaining_Past_month_day + date3 + count_day;
            Pay_Amount_all(total_days, price, bike, chooseemail)
        }
    }
    else {
        let remaining_past_year_Past_month_day = Present_month_days - Past_date;
        let start = Past_month + 1;
        let count_Past_year_day = 0;
        while (start <= 11) {
            count_Past_year_day += main_month_day[start]
            start += 1
        }
        let present_year_present_month = Month;
        let i = 0;
        let count_present_year_day = 0;
        while (i < present_year_present_month) {
            count_present_year_day += main_month_day[i]
            i += 1
        }
        let all_days = remaining_past_year_Past_month_day + date3 + count_Past_year_day + count_present_year_day;
        Pay_Amount_all(all_days, price, bike, chooseemail);
    }
}




function displaySimilarEmails(startingChars) {
    for (const UserEmail in main_rent) {
        if (UserEmail.startsWith(startingChars)) {
            main_list.push(UserEmail);
        }
    }
}



if (fs.existsSync(file_main)) {
    const fileData = fs.readFileSync(file_main, 'utf8');
    main_data = JSON.parse(fileData);
} else {
    const jsonData = JSON.stringify(main_data, null, 5);
    fs.writeFileSync(file_main, jsonData);
    const fileData = fs.readFileSync(file_main, 'utf8');
    main_data = JSON.parse(fileData);
}


if (fs.existsSync(file_rent)) {
    const rentData = fs.readFileSync(file_rent, 'utf8');
    main_rent = JSON.parse(rentData);
} else {
    const jsonData = JSON.stringify(main_rent, null, 5);
    fs.writeFileSync(file_rent, jsonData);
    const fileData = fs.readFileSync(file_rent, 'utf8');
    main_rent = JSON.parse(fileData);
}



function main_data_display() {
    let main_data_user_email = Main_data_user_login_email()
    displaySimilarEmails(main_data_user_email);
    if (main_list.length == 1) {
        let main_list_first_email_data = main_list[0]
        let User_bike_price_list = []
        for (let vehicle in main_rent[main_list_first_email_data]) {
            User_bike_price_list.push(main_rent[main_list_first_email_data][vehicle]);
        }
        let main_month_day = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        let Bike = User_bike_price_list[0]
        let dateString = User_bike_price_list[1]
        let Price = User_bike_price_list[2]
        var dateComponents = dateString.split("/");
        var Past_date = parseInt(dateComponents[0], 10);
        var Past_month = parseInt(dateComponents[1], 10);
        var Past_year = parseInt(dateComponents[2], 10);
        User_bike_price_list.splice(0, User_bike_price_list.length)
        bikerent(Bike, Price, Past_year, Past_month, Past_date, main_month_day);
    }
    else if (main_list.length > 0) {
        console.log(`You have ${main_list.length} Bikerental data of ${main_data[main_data_user_email].Name}`);
        for (let One_user_buy_rent_list of main_list) {
            console.log(One_user_buy_rent_list);
        }

        var chooseemail = input.question("Choose Your Email :->");
        if (main_rent[chooseemail]) {
            let User_bike_price_list = []
            for (let vehicle in main_rent[chooseemail]) {
                User_bike_price_list.push(main_rent[chooseemail][vehicle]);
            }
            let main_month_day = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            let Bike = User_bike_price_list[0]
            let dateString = User_bike_price_list[1]
            let Price = User_bike_price_list[2]
            var dateComponents = dateString.split("/");
            var Past_date = parseInt(dateComponents[0], 10);
            var Past_month = parseInt(dateComponents[1], 10);
            var Past_year = parseInt(dateComponents[2], 10);
            User_bike_price_list.splice(0, User_bike_price_list.length)
            bikerent(Bike, Price, Past_year, Past_month, Past_date, main_month_day, chooseemail);
        }
        else {
            console.log(`Your your email ${chooseemail} is not found`)
        }
    }
    else {
        console.log("You have not any vehicle for rent")
    }
}





function ownerLogin() {
    while (true) {
        var ownerEmail = input.question("Enter owner email:-> ");
        if (owners[ownerEmail]) {
            while (true) {
                var ownerPassword = input.question("Enter owner password:-> ");
                if (owners[ownerEmail].Password === ownerPassword) {
                    break;
                }
                else {
                    console.log("Invalid Owner Password")
                }
            }
            break
        } else {
            console.log("Invalid owner email");
        }
    }
}



function initializeOwner(ownerEmail, passowner) {
    if (!ownersData[ownerEmail]) {
        ownersData[ownerEmail] = {
            password: passowner,
            bikes: {
                Normal: {

                },
                Super: {

                },
                Scooty: {

                }
            },
            cars: {
                Normal: {

                },
                Super: {

                }
            },
        };
    }
}



function initializePrices(ownerEmail, passowner) {
    if (!PricesData[ownerEmail]) {
        PricesData[ownerEmail] = {
            password: passowner,
            bikes: {
                Normal: {

                },
                Super: {

                },
                Scooty: {

                }
            },
            cars: {
                Normal: {

                },
                Super: {

                }
            },
        };
    }

}


function loadOwnersData() {
    if (fs.existsSync(Owner_file)) {
        const fileData = fs.readFileSync(Owner_file, "utf8");
        ownersData = JSON.parse(fileData);
    }
}


function findOwnerData(email) {
    if (ownersData[email]) {
        return ownersData[email];
    } else {
        console.log(`Owner with email ${email} not found.`);
        return null;
    }
}


function Make_table_owner_data() {
    loadOwnersData();
    const ownerEmail = Object.keys(owners);
    const ownerdata = findOwnerData(ownerEmail);
    return ownerdata
}


function displayCustomTabl
(data, prices) {
    console.log('┌────────────────┬────────────────┬─────────────────────┐');
    console.log('│ Normal Bikes   │ Remaining Bike │ One Vehicle Price   │');
    console.log('├────────────────┼────────────────┼─────────────────────┤');

    for (const vehicle in data) {
        const remainingBikes = data[vehicle];
        const price = prices[vehicle];

        console.log(`│ ${vehicle.padEnd(15)}│ ${remainingBikes.toString().padStart(12)}   │ ${price.toString().padStart(11)}         │`);
    }

    console.log('└────────────────┴────────────────┴─────────────────────┘');
}


function saveOwnersData() {
    const jsonData = JSON.stringify(ownersData, null, 4);
    fs.writeFileSync(Owner_file, jsonData);
}


function loadPricesData() {
    if (fs.existsSync(Prices_file)) {
        const fileData = fs.readFileSync(Prices_file, "utf-8");
        PricesData = JSON.parse(fileData)
    }
}


function findPricesData(email) {
    if (PricesData[email]) {
        return PricesData[email];
    } else {
        console.log(`Owner with email ${email} not found.`);
        return null;
    }
}

function Make_table_price_data() {
    loadPricesData();
    const ownerEmail = Object.keys(owners);
    const pricedata = findPricesData(ownerEmail);
    return pricedata
}


function savePricessData() {
    const jsonData = JSON.stringify(PricesData, null, 4);
    fs.writeFileSync(Prices_file, jsonData)
}



function addBike(category, type, quantity) {
    let emailowner = String(Object.keys(owners))
    let passowner = owners[emailowner].Password
    initializeOwner(emailowner, passowner);
    if (!ownersData[emailowner].bikes[category][type]) {
        ownersData[emailowner].bikes[category][type] = 0;

    }
    ownersData[emailowner].bikes[category][type] += Number(quantity);
    saveOwnersData();
}

function remove_bike(category, type, quantity) {
    let emailowner = String(Object.keys(owners))
    ownersData[emailowner].bikes[category][type] = Number(quantity)
    saveOwnersData();
}

function addCar(category, type, quantity) {
    let emailowner = String(Object.keys(owners))
    let passowner = owners[emailowner].Password
    initializeOwner(emailowner, passowner);
    if (!ownersData[emailowner].cars[category][type]) {
        ownersData[emailowner].cars[category][type] = 0;
    }
    ownersData[emailowner].cars[category][type] += Number(quantity);
    saveOwnersData();
}

function remove_car_Program(category, type, quantity) {
    let emailowner = String(Object.keys(owners));
    ownersData[emailowner].cars[category][type] = Number(quantity);
    saveOwnersData();
}




function add_Bike1_prices(category, type, quantity) {
    let emailowner = String(Object.keys(owners))
    let passowner = owners[emailowner].Password
    initializePrices(emailowner, passowner);
    if (!PricesData[emailowner].bikes[category][type]) {
        PricesData[emailowner].bikes[category][type] = 0;

    }
    PricesData[emailowner].bikes[category][type] += Number(quantity);
    savePricessData();
}


function add_Car1_prices(category, type, quantity) {
    let emailowner = String(Object.keys(owners))
    let passowner = owners[emailowner].Password
    initializePrices(emailowner, passowner);
    if (!PricesData[emailowner].cars[category][type]) {
        PricesData[emailowner].cars[category][type] = 0;

    }
    PricesData[emailowner].cars[category][type] += Number(quantity);
    savePricessData();
}


function remove_Bike1_Price(category, type, quantity) {
    let emailowner = String(Object.keys(owners))
    let Past_bikes_prices = PricesData[emailowner].bikes[category][type]
    if ((Past_bikes_prices - quantity) >= 0) {
        PricesData[emailowner].bikes[category][type] -= Number(quantity);
    }
    savePricessData()
}



function Give_quantityBike() {
    while (true) {
        const quantity = input.question("Enter Quantity:->");
        if (quantity > 0) {
            return quantity;
        }
        else {
            console.log("give the positive Quantity")
        }
    }
}


function Make_data_normal_bike() {
    while (true) {
        console.log("1:->Splender\n2:->Bajaj\n3:->Hero Handa\n4:->Super Splender\n5:->Tvs\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give_quantityBike();
            addBike("Normal", "Splender", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give_quantityBike();
            addBike("Normal", "Bajaj", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give_quantityBike();
            addBike("Normal", "Hero Hando", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give_quantityBike();
            addBike("Normal", "Super Splender", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give_quantityBike();
            addBike("Normal", "Tvs", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }
}



function make_data_super_bike() {
    while (true) {
        console.log("1:->Bullet\n2:->KTM\n3:->Apachi\n4:->Pulser\n5:->Avenger\n6:->Go back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give_quantityBike();
            addBike("Super", "Bullet", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give_quantityBike();
            addBike("Super", "KTM", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give_quantityBike();
            addBike("Super", "Apachi", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give_quantityBike();
            addBike("Super", "Pulser", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give_quantityBike();
            addBike("Super", "Avenger", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }
}


function make_data_scooty_bike() {
    while (true) {
        console.log("1:->Tvs Scooty\n2:->Electric Scooty\n3:->Honda Scooty\n4:->Activa Scooty\n5:-Hero Scooty>\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give_quantityBike();
            addBike("Scooty", "Tvs Scooty", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give_quantityBike();
            addBike("Scooty", "ELectric Scooty", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give_quantityBike();
            addBike("Scooty", "Honda Scooty", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give_quantityBike();
            addBike("Scooty", "Activa Scooty", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give_quantityBike();
            addBike("Scooty", "Hero Scooty", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }

}


function select_bikes() {
    while (true) {
        console.log("Bike Types\n1:->Normal\n2:->Super\n3:->Scooty\n4:->Go back");
        const bikeType = input.question("Choose Bike Type:->");
        if (bikeType === "1") {
            Make_data_normal_bike()
        }
        else if (bikeType === "2") {
            make_data_super_bike()
        }
        else if (bikeType === "3") {
            make_data_scooty_bike();
        }
        else if (bikeType === "4") {
            break;
        }
        else {
            console.log("Choose the given option")
        }
    }
}



function Make_data_normal_car() {
    while (true) {
        console.log("1:->Maruti Suzuki\n2:->Toyota Etios\n3:->Honda City\n4:->Verna\n5:->Tata Indigo\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give_quantityBike();
            addCar("Normal", "Maruti Suzuki", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give_quantityBike();
            addCar("Normal", "Toyota Etios", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give_quantityBike();
            addCar("Normal", "Honda City", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give_quantityBike();
            addCar("Normal", "Verna", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give_quantityBike();
            addCar("Normal", "Tata Indigo", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }
}




function make_data_super_car() {
    while (true) {
        console.log("1:->Mercedes\n2:->BMW\n3:->Audi A4\n4:->Mahindra Thar\n5:->Tata Safari\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give_quantityBike();
            addCar("Super", "Mercedes", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give_quantityBike();
            addCar("Super", "BMW", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give_quantityBike();
            addCar("Super", "Audi A4", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give_quantityBike();
            addCar("Super", "Mahindra Thar", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give_quantityBike();
            addCar("Super", "Tata Safari", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }
}




function select_cars() {
    while (true) {
        console.log("Car Types\n1:->Normal\n2:->Super\n3:->Go back");
        const bikeType = input.question("Choose Bike Type:->");
        if (bikeType === "1") {
            Make_data_normal_car()
        }
        else if (bikeType === "2") {
            make_data_super_car()
        }
        else if (bikeType === "3") {
            break;
        }
        else {
            console.log("Choose the given option")
        }
    }
}




function owner_logout() {
    while (true) {
        var ownerEmail = input.question("Enter owner email:-> ");
        if (owners[ownerEmail]) {
            while (true) {
                var ownerPassword = input.question("Enter owner password:-> ");
                if (owners[ownerEmail].Password === ownerPassword) {
                    console.log(`Owner logout is successfully.`);
                    break;
                }
                else {
                    console.log("Invalid Owner Password")
                }
            }
            break
        } else {
            console.log("Invalid owner email");
        }
    }
}




function user_login() {
    while (true) {
        let UserEmail = input.question("Enter Your Email:->");
        if (main_data[UserEmail] && main_data[UserEmail].Name) {
            while (true) {
                let password = input.question("Enter Your Password:->");
                if (main_data[UserEmail].Password == password) {
                    console.log(`Hello, ${main_data[UserEmail].Name}`);
                    return UserEmail;
                }
                else {
                    console.log("User Password is not correct")
                }
            }
            break;
        }
        else {
            console.log("Your Email is Invalid")
        }
    }
}



function normal_bike_rent_make() {
    while (true) {
        const Normail_bike_table = Make_table_owner_data();
        const Normal_bike_table_price = Make_table_price_data();
        displayCustomTable(Normail_bike_table.bikes.Normal, Normal_bike_table_price.bikes.Normal)
        console.log("Which types of bike do you want for rent in normal");
        console.log("1:->Splender\n2:->Bajaj\n3:->Hero Handa\n4:->Super Splender\n5:->Tvs\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Normal_splender_bike = Show_all_owner_Bike_data.bikes.Normal.Splender
            let Normal_splender_bike_price = Show_all_owner_Bike_price_data.bikes.Normal.Splender
            console.log(`Remainig Normal Splender bikes for rent :->${Normal_splender_bike}`);
            console.log(`One Normal Splender bike price for rent :->${Normal_splender_bike_price}`);
            const normal_splender_bike_want = input.question("How many Normal Splender bikes do you want? :->");
            if (normal_splender_bike_want > 0 && normal_splender_bike_want <= Normal_splender_bike) {
                let rest_normal_splender_bike = Normal_splender_bike - normal_splender_bike_want
                remove_bike("Normal", "Splender", rest_normal_splender_bike)
                const Main_date = new Date();
                const Month = Main_date.getMonth();
                const date1 = Main_date.getDate();
                const year = Main_date.getFullYear();
                let date = " ";
                date += date1 + "/" + (Month + 1) + "/" + year;
                let Splender = normal_splender_bike_want;
                let One_splender_price = Normal_splender_bike_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { Splender, date, One_splender_price, Name: name };
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Normal Splender bikes fore rent");
            }
        }
        else if (select1 === "2") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Normal_Bajaj_bike = Show_all_owner_Bike_data.bikes.Normal.Bajaj
            let Normal_bajaj_bike_price = Show_all_owner_Bike_price_data.bikes.Normal.Bajaj
            console.log(`Remainig Normal Bajaj bikes for rent :->${Normal_Bajaj_bike}`);
            console.log(`One Normal Bajaj bike price for rent :->${Normal_bajaj_bike_price}`);
            const normal_bajaj_bike_want = input.question("How many Normal Bajaj bikes do you want? :->");
            if (normal_bajaj_bike_want > 0 && normal_bajaj_bike_want <= Normal_Bajaj_bike) {
                let rest_bajaj_splender_bike = Normal_Bajaj_bike - normal_bajaj_bike_want
                remove_bike("Normal", "Bajaj", rest_bajaj_splender_bike)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year;
                let Bajaj = normal_bajaj_bike_want;
                let one_bajaj_price = Normal_bajaj_bike_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { Bajaj, date, one_bajaj_price, Name: name };
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Normal Bajaj bikes fore rent");
            };
        }
        else if (select1 === "3") {
            let Show_all_owner_Bike_data = Make_table_owner_data();
            let Show_all_owner_Bike_price_data = Make_table_price_data();
            let Normal_Hero_honda_bike = Show_all_owner_Bike_data.bikes.Normal["Hero Hando"];
            let Normal_hero_honda_bike_price = Show_all_owner_Bike_price_data.bikes.Normal["Hero Hando"];
            console.log(`Remainig Normal Hero Honda bikes for rent :->${Normal_Hero_honda_bike}`);
            console.log(`One Normal Hero Honda bikes price for rent :->${Normal_hero_honda_bike_price}`);
            const normal_hero_honda_bike_want = input.question("How many Normal Hero honda bikes do you want? :->");
            if (normal_hero_honda_bike_want > 0 && normal_hero_honda_bike_want <= Normal_Hero_honda_bike) {
                let rest_normal_Hero_honda_bike = Normal_Hero_honda_bike - normal_hero_honda_bike_want;
                remove_bike("Normal", "Hero Hando", rest_normal_Hero_honda_bike);
                const Main_date = new Date();
                const Month = Main_date.getMonth();
                const date1 = Main_date.getDate();
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year;
                let Hero_honda = normal_hero_honda_bike_want;
                let One_Hero_honda_price = Normal_hero_honda_bike_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { "Hero Hando": Hero_honda, date, One_Hero_honda_price, Name: name };
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Normal Hero Honda bikes fore rent");
            }
        }
        else if (select1 === "4") {
            let Show_all_owner_Bike_data = Make_table_owner_data();
            let Show_all_owner_Bike_price_data = Make_table_price_data();
            let Normal_Super_splender_bike = Show_all_owner_Bike_data.bikes.Normal["Super Splender"];
            let Normal_Super_splender_bike_price = Show_all_owner_Bike_price_data.bikes.Normal["Super Splender"];
            console.log(`Remainig Normal Super Splender bikes for rent :->${Normal_Super_splender_bike}`);
            console.log(`One Normal Super Splender bike price for rent :->${Normal_Super_splender_bike_price}`);
            const normal_Super_splender_bike_want = input.question("How many Normal Super Splender bikes do you want? :->");
            if (normal_Super_splender_bike_want > 0 && normal_Super_splender_bike_want <= Normal_Super_splender_bike) {
                let rest_normal_super_splender_bike = Normal_Super_splender_bike - normal_Super_splender_bike_want;
                remove_bike("Normal", "Super Splender", rest_normal_super_splender_bike);
                const Main_date = new Date();
                const Month = Main_date.getMonth();
                const date1 = Main_date.getDate();
                const year = Main_date.getFullYear();
                let date = " ";
                date += date1 + "/" + (Month + 1) + "/" + year;
                let Super_splender = normal_Super_splender_bike_want;
                let One_super_splender_price = Normal_Super_splender_bike_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { "Super Splender": Super_splender, date, One_super_splender_price, Name: name };
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Normal Super_splender bikes fore rent");
            }
        }
        else if (select1 === "5") {
            let Show_all_owner_Bike_data = Make_table_owner_data();
            let Show_all_owner_Bike_price_data = Make_table_price_data();
            let Normal_tvs_bike = Show_all_owner_Bike_data.bikes.Normal["Tvs"];
            let Normal_tvs_bike_price = Show_all_owner_Bike_price_data.bikes.Normal["Tvs"];
            console.log(`Remainig Normal TVS bikes for rent :->${Normal_tvs_bike}`);
            console.log(`One Normal TVS bike price for rent :->${Normal_tvs_bike_price}`);
            const normal_tvs_bike_want = input.question("How many Normal TVS bikes do you want? :->");
            if (normal_tvs_bike_want > 0 && normal_tvs_bike_want <= Normal_tvs_bike) {
                let rest_normal_tvs_bike = Normal_tvs_bike - normal_tvs_bike_want;
                remove_bike("Normal", "Tvs", rest_normal_tvs_bike);
                const Main_date = new Date();
                const Month = Main_date.getMonth();
                const date1 = Main_date.getDate();
                const year = Main_date.getFullYear();
                let date = " ";
                date += date1 + "/" + (Month + 1) + "/" + year;
                let TVS = normal_tvs_bike_want;
                let One_TVS_price = Normal_tvs_bike_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                var bikeprice = { "Tvs": TVS, date, One_TVS_price, Name: name };
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Normal TVS bikes fore rent");
            }
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option");
        }
    }
}




function super_bike_rent_make() {
    while (true) {
        const Super_bike_table = Make_table_owner_data();
        const Super_bike_table_price = Make_table_price_data();
        displayCustomTable(Super_bike_table.bikes.Super, Super_bike_table_price.bikes.Super)
        console.log("Which types of bike do you want for rent in Super");
        console.log("1:->Bullet\n2:->KTM\n3:->Apachi\n4:->Pulser\n5:->Avenger\n6:->Go back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Super_bikes = Show_all_owner_Bike_data.bikes.Super.Bullet
            let super_bikes_price = Show_all_owner_Bike_price_data.bikes.Super.Bullet
            console.log(`Remainig Super Bullet bikes for rent :->${Super_bikes}`);
            console.log(`One Super Bullet bike price for rent :->${super_bikes_price}`);
            const normal_super_bikes_want = input.question("How many Super Bullet bikes do you want? :->");
            if (normal_super_bikes_want > 0 && normal_super_bikes_want <= Super_bikes) {
                let rest_super_bikes = Super_bikes - normal_super_bikes_want
                remove_bike("Super", "Bullet", rest_super_bikes)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year
                let Bullet = normal_super_bikes_want;
                let one_Bullet_price = super_bikes_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { Bullet, date, one_Bullet_price, Name: name }
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Super Bullet bikes fore rent")
            }
        }
        else if (select1 === "2") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Super_bikes = Show_all_owner_Bike_data.bikes.Super.KTM
            let super_bikes_price = Show_all_owner_Bike_price_data.bikes.Super.KTM
            console.log(`Remainig Super KTM bikes for rent :->${Super_bikes}`);
            console.log(`One super KTM bike price for rent :->${super_bikes_price}`);
            const normal_super_bikes_want = input.question("How many Super KTM bikes do you want? :->");
            if (normal_super_bikes_want > 0 && normal_super_bikes_want <= Super_bikes) {
                let rest_super_bikes = Super_bikes - normal_super_bikes_want
                remove_bike("Super", "KTM", rest_super_bikes)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " ";
                date += date1 + "/" + (Month + 1) + "/" + year;
                let KTM = normal_super_bikes_want;
                let one_KTM_price = super_bikes_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { KTM, date, one_KTM_price, Name: name }
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Super KTM bikes fore rent")
            }
        }
        else if (select1 === "3") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Super_bikes = Show_all_owner_Bike_data.bikes.Super.Apachi
            let super_bikes_price = Show_all_owner_Bike_price_data.bikes.Super.Apachi
            console.log(`Remainig Super apachi bikes for rent :->${Super_bikes}`);
            console.log(`One Super apachi bike price for rent :->${super_bikes_price}`);
            const normal_super_bikes_want = input.question("How many Super Apachi bikes do you want? :->");
            if (normal_super_bikes_want > 0 && normal_super_bikes_want <= Super_bikes) {
                let rest_super_bikes = Super_bikes - normal_super_bikes_want
                remove_bike("Super", "Apachi", rest_super_bikes)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year
                let Apachi = normal_super_bikes_want;
                let one_Apachi_price = super_bikes_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { Apachi, date, one_Apachi_price, Name: name }
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Super Apachi bikes fore rent")
            }
        }
        else if (select1 === "4") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Super_bikes = Show_all_owner_Bike_data.bikes.Super.Pulser
            let super_bikes_price = Show_all_owner_Bike_price_data.bikes.Super.Pulser
            console.log(`Remainig Super Pulser bikes for rent :->${Super_bikes}`);
            console.log(`One Super Pulser bike price for rent :->${super_bikes_price}`);
            const normal_super_bikes_want = input.question("How many Super Pulser bikes do you want? :->");
            if (normal_super_bikes_want > 0 && normal_super_bikes_want <= Super_bikes) {
                let rest_super_bikes = Super_bikes - normal_super_bikes_want
                remove_bike("Super", "Pulser", rest_super_bikes)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year
                let Pulser = normal_super_bikes_want;
                let one_Pulser_price = super_bikes_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { Pulser, date, one_Pulser_price, Name: name }
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Super Pulser bikes fore rent")
            }
        }
        else if (select1 === "5") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Super_bikes = Show_all_owner_Bike_data.bikes.Super.Avenger
            let super_bikes_price = Show_all_owner_Bike_price_data.bikes.Super.Avenger
            console.log(`Remainig Super Avenger bikes for rent :->${Super_bikes}`);
            console.log(`One Super Avenger bike price for rent :->${super_bikes_price}`);
            const normal_super_bikes_want = input.question("How many Super Avenger bikes do you want? :->");
            if (normal_super_bikes_want > 0 && normal_super_bikes_want <= Super_bikes) {
                let rest_super_bikes = Super_bikes - normal_super_bikes_want
                remove_bike("Super", "Avenger", rest_super_bikes)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year
                let Avenger = normal_super_bikes_want;
                let one_Avenger_price = super_bikes_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { Avenger, date, one_Avenger_price, Name: name }
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Super Avenger bikes fore rent")
            }
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }

}


function scooty_bike_rent_make() {
    while (true) {
        const Scooty_bike_table = Make_table_owner_data();
        const Scooty_bike_table_price = Make_table_price_data();
        displayCustomTable(Scooty_bike_table.bikes.Scooty, Scooty_bike_table_price.bikes.Scooty)
        console.log("Which types of bike do you want for rent in Scooty");
        console.log("1:->Tvs Scooty\n2:->Electric Scooty\n3:->Honda Scooty\n4:->Activa Scooty\n5:-Hero Scooty>\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Scooty_bikes_setting = Show_all_owner_Bike_data.bikes.Scooty["Tvs Scooty"]
            let Scooty_bikes_setting_price = Show_all_owner_Bike_price_data.bikes.Scooty["Tvs Scooty"]
            console.log(`Remainig TVS Scooty bikes for rent :->${Scooty_bikes_setting}`);
            console.log(`One TVS Scooty bike price for rent :->${Scooty_bikes_setting_price}`);
            const normal_Scooty_bikes_want = input.question("How many TVS Scooty bikes do you want? :->");
            if (normal_Scooty_bikes_want > 0 && normal_Scooty_bikes_want <= Scooty_bikes_setting) {
                let rest_normal_scooty_bikes = Scooty_bikes_setting - normal_Scooty_bikes_want
                remove_bike("Scooty", "Tvs Scooty", rest_normal_scooty_bikes)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year;
                let TVS_Scooty = normal_Scooty_bikes_want
                let one_TVS_Scooty_price = Scooty_bikes_setting_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { "Tvs Scooty": TVS_Scooty, date, one_TVS_Scooty_price, Name: name }
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more TVS Scooty bikes fore rent")
            }
        }
        else if (select1 === "2") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Scooty_bikes_setting = Show_all_owner_Bike_data.bikes.Scooty["ELectric Scooty"]
            let Scooty_bikes_setting_price = Show_all_owner_Bike_price_data.bikes.Scooty["ELectric Scooty"]
            console.log(`Remainig Electric Scooty bikes for rent :->${Scooty_bikes_setting}`);
            console.log(`One Electric Scooty bike price for rent :->${Scooty_bikes_setting_price}`);
            const normal_Scooty_bikes_want = input.question("How many Electric Scooty bikes do you want? :->");
            if (normal_Scooty_bikes_want > 0 && normal_Scooty_bikes_want <= Scooty_bikes_setting) {
                let rest_normal_scooty_bikes = Scooty_bikes_setting - normal_Scooty_bikes_want
                remove_bike("Scooty", "ELectric Scooty", rest_normal_scooty_bikes)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year
                let Electric_Scooty = normal_Scooty_bikes_want
                let one_Electric_Scooty_price = Scooty_bikes_setting_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { "ELectric Scooty": Electric_Scooty, date, one_Electric_Scooty_price, Name: name }
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Electric_Scooty bikes fore rent")
            }
        }
        else if (select1 === "3") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Scooty_bikes_setting = Show_all_owner_Bike_data.bikes.Scooty["Honda Scooty"]
            let Scooty_bikes_setting_price = Show_all_owner_Bike_price_data.bikes.Scooty["Honda Scooty"]
            console.log(`Remainig Honda Scooty bikes for rent :->${Scooty_bikes_setting}`);
            console.log(`One Honda Scooty bike price for rent :->${Scooty_bikes_setting_price}`);
            const normal_Scooty_bikes_want = input.question("How many Honda Scooty bikes do you want? :->");
            if (normal_Scooty_bikes_want > 0 && normal_Scooty_bikes_want <= Scooty_bikes_setting) {
                let rest_normal_scooty_bikes = Scooty_bikes_setting - normal_Scooty_bikes_want
                remove_bike("Scooty", "Honda Scooty", rest_normal_scooty_bikes)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year
                let Honda_Scooty = normal_Scooty_bikes_want
                let one_Honda_Scooty_price = Scooty_bikes_setting_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { "Honda Scooty": Honda_Scooty, date, one_Honda_Scooty_price, Name: name }
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Honda Scooty bikes fore rent")
            }
        }
        else if (select1 === "4") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Scooty_bikes_setting = Show_all_owner_Bike_data.bikes.Scooty["Activa Scooty"]
            let Scooty_bikes_setting_price = Show_all_owner_Bike_price_data.bikes.Scooty["Activa Scooty"]
            console.log(`Remainig Activa Scooty bikes for rent :->${Scooty_bikes_setting}`);
            console.log(`One Activa Scooty bike price for rent :->${Scooty_bikes_setting_price}`);
            const normal_Scooty_bikes_want = input.question("How many Activa Scooty bikes do you want? :->");
            if (normal_Scooty_bikes_want > 0 && normal_Scooty_bikes_want <= Scooty_bikes_setting) {
                let rest_normal_scooty_bikes = Scooty_bikes_setting - normal_Scooty_bikes_want
                remove_bike("Scooty", "Activa Scooty", rest_normal_scooty_bikes)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year;
                let Activa_Scooty = normal_Scooty_bikes_want;
                let one_Activa_Scooty_price = Scooty_bikes_setting_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name;
                let bikeprice = { "Activa Scooty": Activa_Scooty, date, one_Activa_Scooty_price, Name: name }
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Activa Scooty bikes fore rent")
            }
        }
        else if (select1 === "5") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Scooty_bikes_setting = Show_all_owner_Bike_data.bikes.Scooty["Hero Scooty"]
            let Scooty_bikes_setting_price = Show_all_owner_Bike_price_data.bikes.Scooty["Hero Scooty"]
            console.log(`Remainig Hero Scooty bikes for rent :->${Scooty_bikes_setting}`);
            console.log(`One Hero Scooty bike price for rent :->${Scooty_bikes_setting_price}`);
            const normal_Scooty_bikes_want = input.question("How manyHero Scooty bike do you want? :->");
            if (normal_Scooty_bikes_want > 0 && normal_Scooty_bikes_want <= Scooty_bikes_setting) {
                let rest_normal_scooty_bikes = Scooty_bikes_setting - normal_Scooty_bikes_want
                remove_bike("Scooty", "Hero Scooty", rest_normal_scooty_bikes)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year
                let Hero_Scooty = normal_Scooty_bikes_want
                let one_Hero_Scooty_price = Scooty_bikes_setting_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { "Hero Scooty": Hero_Scooty, date, one_Hero_Scooty_price, Name: name }
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Hero Scooty bikes fore rent")
            }
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }
}


function normal_car_rent_make() {
    while (true) {
        const Normail_car_table = Make_table_owner_data();
        const Normal_car_table_price = Make_table_price_data();
        displayCustomTable(Normail_car_table.cars.Normal, Normal_car_table_price.cars.Normal)
        console.log("Which types of car do you want for rent in normal");
        console.log("1:->Maruti Suzuki\n2:->Toyota Etios\n3:->Honda City\n4:->Verna\n5:->Tata Indigo\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            let Show_all_owner_Bike_data = Make_table_owner_data();
            let Show_all_owner_Bike_price_data = Make_table_price_data();
            let normal_car_Program = Show_all_owner_Bike_data.cars.Normal["Maruti Suzuki"]
            let normal_car_program_price = Show_all_owner_Bike_price_data.cars.Normal["Maruti Suzuki"]
            console.log(`Remainig Normal Maruti Suzuki cars for rent :->${normal_car_Program}`);
            console.log(`One Normal Maruti Suzuki car price for rent :->${normal_car_program_price}`);
            const normal_car_program_want = input.question("How many Normal Maruti Suzuki cars do you want? :->");
            if (normal_car_program_want > 0 && normal_car_program_want <= normal_car_Program) {
                let rest_normal_car = normal_car_Program - normal_car_program_want
                remove_car_Program("Normal", "Maruti Suzuki", rest_normal_car)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year
                let Maruti_Suzuki = normal_car_program_want
                let one_Maruti_Suzuki_price = normal_car_program_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { "Maruti Suzuki": Maruti_Suzuki, date, one_Maruti_Suzuki_price, Name: name }
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Normal Maruti Suzuki cars fore rent")
            }
        }
        else if (select1 === "2") {
            let Show_all_owner_Bike_data = Make_table_owner_data();
            let Show_all_owner_Bike_price_data = Make_table_price_data();
            let normal_car_Program = Show_all_owner_Bike_data.cars.Normal["Toyota Etios"];
            let normal_car_program_price = Show_all_owner_Bike_price_data.cars.Normal["Toyota Etios"];
            console.log(`Remainig Normal Toyota Etios cars for rent :->${normal_car_Program}`);
            console.log(`One Normal Toyota Etios car price for rent :->${normal_car_program_price}`);
            const normal_car_program_want = input.question("How many Normal Toyota Etios cars do you want? :->");
            if (normal_car_program_want > 0 && normal_car_program_want <= normal_car_Program) {
                let rest_normal_car = normal_car_Program - normal_car_program_want;
                remove_car_Program("Normal", "Toyota Etios", rest_normal_car);
                const Main_date = new Date();
                const Month = Main_date.getMonth();
                const date1 = Main_date.getDate();
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year;
                let Toyota_Etios = normal_car_program_want;
                let one_Toyota_Etios_price = normal_car_program_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { "Toyota Etios": Toyota_Etios, date, one_Toyota_Etios_price, Name: name };
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Normal Toyota Etios cars fore rent")
            }
        }
        else if (select1 === "3") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let normal_car_Program = Show_all_owner_Bike_data.cars.Normal["Honda City"]
            let normal_car_program_price = Show_all_owner_Bike_price_data.cars.Normal["Honda City"]
            console.log(`Remainig Normal Honda City cars for rent :->${normal_car_Program}`);
            console.log(`One Normal Honda City car price for rent :->${normal_car_program_price}`);
            const normal_car_program_want = input.question("How many Honda City cars do you want? :->");
            if (normal_car_program_want > 0 && normal_car_program_want <= normal_car_Program) {
                let rest_normal_car = normal_car_Program - normal_car_program_want;
                remove_car_Program("Normal", "Honda City", rest_normal_car);
                const Main_date = new Date();
                const Month = Main_date.getMonth();
                const date1 = Main_date.getDate();
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year
                let Honda_City = normal_car_program_want
                let one_Honda_City_price = normal_car_program_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { "Honda City": Honda_City, date, one_Honda_City_price, Name: name }
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Normal Honda City cars fore rent")
            }
        }
        else if (select1 === "4") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let normal_car_Program = Show_all_owner_Bike_data.cars.Normal["Verna"]
            let normal_car_program_price = Show_all_owner_Bike_price_data.cars.Normal["Verna"]
            console.log(`Remainig Normal Verna cars for rent :->${normal_car_Program}`);
            console.log(`One Normal Verna car price for rent :->${normal_car_program_price}`);
            const normal_car_program_want = input.question("How many Verna cars do you want? :->");
            if (normal_car_program_want > 0 && normal_car_program_want <= normal_car_Program) {
                let rest_normal_car = normal_car_Program - normal_car_program_want
                remove_car_Program("Normal", "Verna", rest_normal_car)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " ";
                date += date1 + "/" + (Month + 1) + "/" + year;
                let Verna = normal_car_program_want;
                let one_Verna_price = normal_car_program_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { Verna, date, one_Verna_price, Name: name };
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Normal Verna cars fore rent")
            }
        }
        else if (select1 === "5") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let normal_car_Program = Show_all_owner_Bike_data.cars.Normal["Tata Indigo"]
            let normal_car_program_price = Show_all_owner_Bike_price_data.cars.Normal["Tata Indigo"]
            console.log(`Remainig Normal Tata Indigo cars for rent :->${normal_car_Program}`);
            console.log(`One Normal Tata Indigo car price for rent :->${normal_car_program_price}`);
            const normal_car_program_want = input.question("How many Tata Indigo cars do you want? :->");
            if (normal_car_program_want > 0 && normal_car_program_want <= normal_car_Program) {
                let rest_normal_car = normal_car_Program - normal_car_program_want
                remove_car_Program("Normal", "Tata Indigo", rest_normal_car)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1) + "/" + year;
                let Tata_Indigo = normal_car_program_want;
                let one_Tata_Indigo_price = normal_car_program_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { "Tata Indigo": Tata_Indigo, date, one_Tata_Indigo_price, Name: name };
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Normal Tata Indigo cars fore rent");
            }
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option");
        }
    }
}



function super_car_rent_make() {
    while (true) {
        const Super_car_table = Make_table_owner_data();
        const Super_car_table_price = Make_table_price_data();
        displayCustomTable(Super_car_table.cars.Super, Super_car_table_price.cars.Super)
        console.log("Which types of car do you want for rent in super");
        console.log("1:->Mercedes\n2:->BMW\n3:->Audi A4\n4:->Mahindra Thar\n5:->Tata Safari\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Super_car_Program = Show_all_owner_Bike_data.cars.Super["Mercedes"]
            let Super_car_program_price = Show_all_owner_Bike_price_data.cars.Super["Mercedes"]
            console.log(`Remainig Super Mercedes cars for rent :->${Super_car_Program}`);
            console.log(`One Super Mercedes car price for rent :->${Super_car_program_price}`);
            const Super_car_program_want = input.question("How many Super Mercedes cars do you want? :->");
            if (Super_car_program_want > 0 && Super_car_program_want <= Super_car_Program) {
                let rest_Super_car = Super_car_Program - Super_car_program_want
                remove_car_Program("Super", "Mercedes", rest_Super_car)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1)
                    + "/" + year;
                let Mercedes = Super_car_program_want;
                let one_Mercedes_price = Super_car_program_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { Mercedes, date, one_Mercedes_price, Name: name };
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Super Mercedes cars fore rent");
            }
        }
        else if (select1 === "2") {
            let Show_all_owner_Bike_data = Make_table_owner_data();
            let Show_all_owner_Bike_price_data = Make_table_price_data();
            let Super_car_Program = Show_all_owner_Bike_data.cars.Super["BMW"];
            let Super_car_program_price = Show_all_owner_Bike_price_data.cars.Super["BMW"];
            console.log(`Remainig Super BMW cars for rent :->${Super_car_Program}`);
            console.log(`One Super BMW car price for rent :->${Super_car_program_price}`);
            const Super_car_program_want = input.question("How many Super BMW cars do you want? :->");
            if (Super_car_program_want > 0 && Super_car_program_want <= Super_car_Program) {
                let rest_Super_car = Super_car_Program - Super_car_program_want;
                remove_car_Program("Super", "BMW", rest_Super_car);
                const Main_date = new Date();
                const Month = Main_date.getMonth();
                const date1 = Main_date.getDate();
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1)
                    + "/" + year;
                let BMW = Super_car_program_want;
                let one_BMW_price = Super_car_program_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { BMW, date, one_BMW_price, Name: name };
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Super BMW cars fore rent");
            }
        }
        else if (select1 === "3") {
            let Show_all_owner_Bike_data = Make_table_owner_data();
            let Show_all_owner_Bike_price_data = Make_table_price_data();
            let Super_car_Program = Show_all_owner_Bike_data.cars.Super["Audi A4"];
            let Super_car_program_price = Show_all_owner_Bike_price_data.cars.Super["Audi A4"];
            console.log(`Remainig Super Audi A4 cars for rent :->${Super_car_Program}`);
            console.log(`One Super Audi A4 car price for rent :->${Super_car_program_price}`);
            const Super_car_program_want = input.question("How many Super Audi A4 cars do you want? :->");
            if (Super_car_program_want > 0 && Super_car_program_want <= Super_car_Program) {
                let rest_Super_car = Super_car_Program - Super_car_program_want;
                remove_car_Program("Super", "Audi A4", rest_Super_car);
                const Main_date = new Date();
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1)
                    + "/" + year
                let Audi_A4 = Super_car_program_want;
                let one_Audi_A4_price = Super_car_program_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { "Audi A4": Audi_A4, date, one_Audi_A4_price, Name: name };
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Super Audi A4 cars fore rent")
            }
        }
        else if (select1 === "4") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Super_car_Program = Show_all_owner_Bike_data.cars.Super["Mahindra Thar"]
            let Super_car_program_price = Show_all_owner_Bike_price_data.cars.Super["Mahindra Thar"]
            console.log(`Remainig Super Mahindra Thar cars for rent :->${Super_car_Program}`);
            console.log(`One Super Mahindra Thar car price for rent :->${Super_car_program_price}`);
            const Super_car_program_want = input.question("How many Super Mahindra Thar cars do you want? :->");
            if (Super_car_program_want > 0 && Super_car_program_want <= Super_car_Program) {
                let rest_Super_car = Super_car_Program - Super_car_program_want
                remove_car_Program("Super", "Mahindra Thar", rest_Super_car)
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1)
                    + "/" + year;
                let Mahindra_Thar = Super_car_program_want;
                let one_Mahindra_Thar_price = Super_car_program_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { "Mahindra Thar": Mahindra_Thar, date, one_Mahindra_Thar_price, Name: name }
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Super Mahindra Thar cars fore rent")
            }
        }
        else if (select1 === "5") {
            let Show_all_owner_Bike_data = Make_table_owner_data()
            let Show_all_owner_Bike_price_data = Make_table_price_data()
            let Super_car_Program = Show_all_owner_Bike_data.cars.Super["Tata Safari"]
            let Super_car_program_price = Show_all_owner_Bike_price_data.cars.Super["Tata Safari"]
            console.log(`Remainig Super Tata Safari cars for rent :->${Super_car_Program}`);
            console.log(`One Super Tata Safari car price for rent :->${Super_car_program_price}`);
            const Super_car_program_want = input.question("How many Super Tata Safari cars do you want? :->");
            if (Super_car_program_want > 0 && Super_car_program_want <= Super_car_Program) {
                let rest_Super_car = Super_car_Program - Super_car_program_want;
                remove_car_Program("Super", "Tata Safari", rest_Super_car);
                const Main_date = new Date()
                const Month = Main_date.getMonth()
                const date1 = Main_date.getDate()
                const year = Main_date.getFullYear();
                let date = " "
                date += date1 + "/" + (Month + 1)
                    + "/" + year
                let Tata_Safari = Super_car_program_want
                let one_Tata_Safari_price = Super_car_program_price;
                let email = [Main_data_user_login_email()];
                let name = main_data[email].Name
                let bikeprice = { "Tata Safari": Tata_Safari, date, one_Tata_Safari_price, Name: name }
                addPrice(bikeprice, email);
            }
            else {
                console.log("I have not more Super Tata Safari cars fore rent")
            }
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }
}




function create_vehicle() {
    while (true) {
        console.log("Which type of Vehicle do you want for rent\n1:-Bikes\n2:-Cars\n3:-Go Back");
        let option = input.question("Choose Your Option:->");
        if (option === "1") {
            while (true) {
                console.log("Types Of Bikes\n1:->Normal\n2:->Super\n3:->Scooty\n4:->Go back")
                let select = input.question("Select Your Option:->")
                if (select === "1") {
                    normal_bike_rent_make()
                }
                else if (select === "2") {
                    super_bike_rent_make()
                }
                else if (select === "3") {
                    scooty_bike_rent_make()
                }
                else if (select === "4") {
                    break;
                }
                else {
                    console.log("Choose Your Option")
                }
            }
        }
        else if (option == "2") {
            while (true) {
                console.log("Types Of Cars\n1:->Normal\n2:->Super\n3:->Go back")
                let select = input.question("Select Your Option:->")
                if (select === "1") {
                    normal_car_rent_make()
                }
                else if (select === "2") {
                    super_car_rent_make()
                }
                else if (select === "3") {
                    break;
                }
                else {
                    console.log("Choose Your Option")
                }
            }
        }
        else if (option == "3") {
            break;
        }
        else {
            console.log("Please choose in given option");
        }
    }


}



function Give1_quantityBike() {
    while (true) {
        const quantity = input.question("Enter Your Price:->");
        if (quantity > 0) {
            return quantity;
        }
        else {
            console.log("give the positive Quantity")
        }
    }
}


function Make1_data_normal_bike() {
    while (true) {
        console.log("1:->Splender\n2:->Bajaj\n3:->Hero Handa\n4:->Super Splender\n5:->Tvs\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give1_quantityBike();
            add_Bike1_prices("Normal", "Splender", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give1_quantityBike();
            add_Bike1_prices("Normal", "Bajaj", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give1_quantityBike();
            add_Bike1_prices("Normal", "Hero Hando", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give1_quantityBike();
            add_Bike1_prices("Normal", "Super Splender", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give1_quantityBike();
            add_Bike1_prices("Normal", "Tvs", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }
}



function make2_data_super_bike() {
    while (true) {
        console.log("1:->Bullet\n2:->KTM\n3:->Apachi\n4:->Pulser\n5:->Avenger\n6:->Go back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give1_quantityBike()
            add_Bike1_prices("Super", "Bullet", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give1_quantityBike()
            add_Bike1_prices("Super", "KTM", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give1_quantityBike()
            add_Bike1_prices("Super", "Apachi", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give1_quantityBike()
            add_Bike1_prices("Super", "Pulser", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give1_quantityBike()
            add_Bike1_prices("Super", "Avenger", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }
}


function make3_data_scooty_bike() {
    while (true) {
        console.log("1:->Tvs Scooty\n2:->Electric Scooty\n3:->Honda Scooty\n4:->Activa Scooty\n5:-Hero Scooty>\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give1_quantityBike()
            add_Bike1_prices("Scooty", "Tvs Scooty", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give1_quantityBike()
            add_Bike1_prices("Scooty", "ELectric Scooty", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give1_quantityBike()
            add_Bike1_prices("Scooty", "Honda Scooty", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give1_quantityBike()
            add_Bike1_prices("Scooty", "Activa Scooty", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give1_quantityBike()
            add_Bike1_prices("Scooty", "Hero Scooty", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }

}





function select1_bikes() {
    while (true) {
        console.log("Bike Types\n1:->Normal\n2:->Super\n3:->Scooty\n4:->Go back");
        const bikeType = input.question("Choose Bike Type:->");
        if (bikeType === "1") {
            Make1_data_normal_bike()
        }
        else if (bikeType === "2") {
            make2_data_super_bike()
        }
        else if (bikeType === "3") {
            make3_data_scooty_bike();
        }
        else if (bikeType === "4") {
            break;
        }
        else {
            console.log("Choose the given option")
        }
    }
}



function Make1_data_normal_car() {
    while (true) {
        console.log("1:->Maruti Suzuki\n2:->Toyota Etios\n3:->Honda City\n4:->Verna\n5:->Tata Indigo\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give1_quantityBike()
            add_Car1_prices("Normal", "Maruti Suzuki", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give1_quantityBike()
            add_Car1_prices("Normal", "Toyota Etios", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give1_quantityBike()
            add_Car1_prices("Normal", "Honda City", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give1_quantityBike()
            add_Car1_prices("Normal", "Verna", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give1_quantityBike()
            add_Car1_prices("Normal", "Tata Indigo", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }
}




function make1_data_super_car() {
    while (true) {
        console.log("1:->Mercedes\n2:->BMW\n3:->Audi A4\n4:->Mahindra Thar\n5:->Tata Safari\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give1_quantityBike()
            add_Car1_prices("Super", "Mercedes", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give1_quantityBike()
            add_Car1_prices("Super", "BMW", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give1_quantityBike()
            add_Car1_prices("Super", "Audi A4", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give1_quantityBike()
            add_Car1_prices("Super", "Mahindra Thar", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give1_quantityBike()
            add_Car1_prices("Super", "Tata Safari", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }
}


function select1_cars() {
    while (true) {
        console.log("Car Types\n1:->Normal\n2:->Super\n3:->Go back");
        const bikeType = input.question("Choose Bike Type:->");
        if (bikeType === "1") {
            Make1_data_normal_car()
        }
        else if (bikeType === "2") {
            make1_data_super_car()
        }
        else if (bikeType === "3") {
            break;
        }
        else {
            console.log("Choose the given option")
        }
    }
}


function Increase_Price() {
    while (true) {
        console.log("Add Prices\n1:->Bike\n2:->Car\n3:->Go Back");
        const ownerOption = input.question("Choose Your Option:->");
        if (ownerOption === "1") {
            select1_bikes()
        } else if (ownerOption === "2") {
            select1_cars()
        } else if (ownerOption === "3") {
            break;
        }
        else {
            console.log("choose the given Option")
        }
    }

}


function Give_quantityBike_decrease_price() {
    while (true) {
        const quantity = input.question("Enter Your  Decrease Price:->");
        if (quantity > 0) {
            return quantity;
        }
        else {
            console.log("give the positive Quantity")
        }
    }
}


function Make_data1_normal_bike() {
    while (true) {
        console.log("1:->Splender\n2:->Bajaj\n3:->Hero Handa\n4:->Super Splender\n5:->Tvs\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Normal", "Splender", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Normal", "Bajaj", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Normal", "Hero Hando", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Normal", "Super Splender", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Normal", "Tvs", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }
}



function make_data2_super_bike() {
    while (true) {
        console.log("1:->Bullet\n2:->KTM\n3:->Apachi\n4:->Pulser\n5:->Avenger\n6:->Go back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Super", "Bullet", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Super", "KTM", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Super", "Apachi", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Super", "Pulser", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Super", "Avenger", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }
}


function make_data3_scooty_bike() {
    while (true) {
        console.log("1:->Tvs Scooty\n2:->Electric Scooty\n3:->Honda Scooty\n4:->Activa Scooty\n5:-Hero Scooty>\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Scooty", "Tvs Scooty", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Scooty", "ELectric Scooty", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Scooty", "Honda Scooty", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Scooty", "Activa Scooty", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give_quantityBike_decrease_price();
            remove_Bike1_Price("Scooty", "Hero Scooty", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }

}





function select2_bikes() {
    while (true) {
        console.log("Bike Types\n1:->Normal\n2:->Super\n3:->Scooty\n4:->Go back");
        const bikeType = input.question("Choose Bike Type:->");
        if (bikeType === "1") {
            Make_data1_normal_bike()
        }
        else if (bikeType === "2") {
            make_data2_super_bike()
        }
        else if (bikeType === "3") {
            make_data3_scooty_bike();
        }
        else if (bikeType === "4") {
            break;
        }
        else {
            console.log("Choose the given option")
        }
    }
}







function Make_data1_normal_car() {
    while (true) {
        console.log("1:->Maruti Suzuki\n2:->Toyota Etios\n3:->Honda City\n4:->Verna\n5:->Tata Indigo\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give_quantityBike_decrease_price();
            add_Car1_prices("Normal", "Maruti Suzuki", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give_quantityBike_decrease_price();
            add_Car1_prices("Normal", "Toyota Etios", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give_quantityBike_decrease_price();
            add_Car1_prices("Normal", "Honda City", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give_quantityBike_decrease_price();
            add_Car1_prices("Normal", "Verna", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give_quantityBike_decrease_price();
            add_Car1_prices("Normal", "Tata Indigo", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }
}



function make_data2_super_car() {
    while (true) {
        console.log("1:->Mercedes\n2:->BMW\n3:->Audi A4\n4:->Mahindra Thar\n5:->Tata Safari\n6:->Go Back")
        let select1 = input.question("Select Your option:->");
        if (select1 === "1") {
            const quantityBike = Give_quantityBike_decrease_price();
            add_Car1_prices("Super", "Mercedes", quantityBike);
        }
        else if (select1 === "2") {
            const quantityBike = Give_quantityBike_decrease_price();
            add_Car1_prices("Super", "BMW", quantityBike);
        }
        else if (select1 === "3") {
            const quantityBike = Give_quantityBike_decrease_price();
            add_Car1_prices("Super", "Audi A4", quantityBike);
        }
        else if (select1 === "4") {
            const quantityBike = Give_quantityBike_decrease_price();
            add_Car1_prices("Super", "Mahindra Thar", quantityBike);
        }
        else if (select1 === "5") {
            const quantityBike = Give_quantityBike_decrease_price();
            add_Car1_prices("Super", "Tata Safari", quantityBike);
        }
        else if (select1 === "6") {
            break;
        }
        else {
            console.log("select the given option")
        }
    }
}



function select2_cars() {
    while (true) {
        console.log("Car Types\n1:->Normal\n2:->Super\n3:->Go back");
        const bikeType = input.question("Choose Bike Type:->");
        if (bikeType === "1") {
            Make_data1_normal_car()
        }
        else if (bikeType === "2") {
            make_data2_super_car()
        }
        else if (bikeType === "3") {
            break;
        }
        else {
            console.log("Choose the given option")
        }
    }
}


function Decrease_Price() {
    while (true) {
        console.log("Decrease Prices\n1:->Bike\n2:->Car\n3:->Go Back");
        const ownerOption = input.question("Choose Your Option:->");
        if (ownerOption === "1") {
            select2_bikes()
        } else if (ownerOption === "2") {
            select2_cars()
        } else if (ownerOption === "3") {
            break;
        }
        else {
            console.log("choose the given Option")
        }
    }
}


function select_price() {
    while (true) {
        console.log("1:->Increase Price\n2:->Decrease Price\n3:->Go Back");
        let select2 = input.question("Select Your Option:->")
        if (select2 === "1") {
            Increase_Price()
        }
        else if (select2 === "2") {
            Decrease_Price()
        }
        else if (select2 === "3") {
            break
        }
        else {
            console.log("choose the given Option")
        }
    }
}


loadPricesData()
loadOwnersData()


function just_user_buy_vehicle() {
    while (true) {
        console.log("1:->Pay vehicle for rent\n2:->Buy vehicle for rent\n3:->Go back");
        let select_option = input.question("Select Your Option:->");
        if (select_option === "1") {
            main_data_display()
        }
        else if (select_option === "2") {
            create_vehicle()
        }
        else if (select_option === "3") {
            break
        }
        else {
            console.log("choose the given option")
        }
    }


}




function display_customer_data_Table() {
    console.log('┌────────────────────────────────────────┬─────────────────────┬──────────────────────────┬──────────────────┬───────────┐');
    console.log('│         Name                           │    Vehicle Name     │            Date          │          Price   │  Quantity │');
    console.log('├────────────────────────────────────────┼─────────────────────┼──────────────────────────┼──────────────────┼───────────┤');
    let main_obj = {};
    const display_list = Object.keys(main_rent);
    for (const table of display_list) {
        main_obj[table] = main_rent[table];
        let keys = Object.keys(main_obj[table]);
        let values = Object.values(main_obj[table]);
        let pricee = values[0] * values[2]
        console.log(`│ ${values[3].padEnd(38)} │ ${keys[0].padEnd(15)}     │ ${values[1].padEnd(15)}          │ ${pricee.toString().padStart(10)}       │ ${values[0].toString().padEnd(5)}     │`);
    }
    console.log('└────────────────────────────────────────┴─────────────────────┴──────────────────────────┴──────────────────┴───────────┘');
}

function display_owner_data_table() {
    console.log('┌────────────────────────────────────────┬─────────────────────┬──────────────────────────┐');
    console.log('│         Name                           │    Vehicle Name     │     One Vehicle Price    │');
    console.log('├────────────────────────────────────────┼─────────────────────┼──────────────────────────┤');
    const email = Object.keys(owners);
    let display_list = findPricesData(email);
    let keys_dispaly = Object.keys(display_list);
    for (let category of keys_dispaly) {
        if (display_list.hasOwnProperty(category) && typeof display_list[category] === 'object') {
            for (let subCategory in display_list[category]) {
                let key = display_list[category][subCategory]
                let keys_bike = Object.keys(key);
                let values_bike = Object.values(key)
                for (let i in keys_bike) {
                    console.log(`│ ${email.toString().padEnd(39) }│ ${keys_bike[i].padEnd(15)}     │ ${values_bike[i].toString().padEnd(15)}          │`)
                }
            }
        }
    }
    console.log('└────────────────────────────────────────┴─────────────────────┴──────────────────────────┴');
}

while (true) {
    console.log("1:->Login\n2:->Signup\n3:->Owner login");
    choose1 = input.question("Select Your Option:->")
    if (choose1 === "1") {
        let login_user_email = user_login();
        function Main_data_user_login_email() {
            return login_user_email
        }
        while (true) {
            console.log("1:->Pay vehicle Rent\n2:->Buy Vehicle For Rent\n3:->Go Back");
            let choose2 = input.question("Choose Your Option:->");
            if (choose2 === "1") {
                main_data_display()
            }
            else if (choose2 === "2") {
                create_vehicle()
            }
            else if (choose2 === "3") {
                break;
            }
            else {
                console.log("Choose only given option")
            }
        }

    }


    else if (choose1 === "2") {
        while (true) {
            console.log("1:->Create new account\n2:->Go back");
            let selected_option = input.question("Select Your Option");
            if (selected_option === "1") {
                name();
                validateEmail();
                valid_password();
                valid_Phonenumber();
                const account = { Name: name_validation.Name, Password: validation_password.Password, Phonenumber: validation_Phonenumber.Phonenumber }
                const userEmail = [validadtion_email.email];
                const Phonenumber = validation_Phonenumber.Phonenumber;
                delete validadtion_email.email;
                delete validation_password.Password;
                delete validation_Phonenumber.Phonenumber;
                delete name_validation.Name;
                addUser(userEmail, account, Phonenumber);
                function Main_data_user_login_email() {
                    return userEmail;
                }
                just_user_buy_vehicle();
            }
            else if (selected_option == "2") {
                break
            }
            else {
                console.log("select the given option")
            }

        }

    }

    else if (choose1 === "3") {
        ownerLogin();
        while (true) {
            console.log("1:->Add Bike\n2:->Add Car\n3:->Price\n4:->Display Customer List\n5:->Display Owner List\n6:->Logout");
            const ownerOption = input.question("Choose Your Option:->");
            if (ownerOption === "1") {
                select_bikes();
            } else if (ownerOption === "2") {
                select_cars();
            } else if (ownerOption === "3") {
                select_price();
            } else if (ownerOption === "4") {
                display_customer_data_Table();

            }
            else if (ownerOption === "5") {
                display_owner_data_table()
            } else if (ownerOption === "6") {
                owner_logout();
                break;
            } else {
                console.log("Invalid option. Please choose a valid option.");
            };
        };
        break;
    }
    else {
        console.log("Choose only given option");
    }
}

