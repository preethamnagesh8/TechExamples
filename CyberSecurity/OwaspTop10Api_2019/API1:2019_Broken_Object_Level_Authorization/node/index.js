const express = require('express')
const session = require('express-session');
const app = express()
const port = 3000


app.use(express.urlencoded())
app.use(session({secret: 'ssshhhhh'}));

var sess;

const database = {
    logins: {
        'suppandi@gmail.com': {
            'password': '1234',
            'userId': 'user1'
        },
        'virat.kohli@gmail.com': {
            'password': 'virat@123',
            'userId': 'user20'
        }
    },
    userDetails: {
        'user1': {
            'name': 'Suppandi',
            'shopList': [1,2],
            'shops': [
                {
                    shopId: 1,
                    shopName: 'Stupid Shop 1'
                },
                {
                    shopId: 2,
                    shopName: 'Stupid Shop 2'
                }
            ]
        },
        'user20': {
            'name': 'Virat Kohli',
            'shopList': [3,4],
            'shops': [
                {
                    shopId: 3,
                    shopName: 'Wrogn'
                },
                {
                    shopId: 4,
                    shopName: 'One 8'
                }
            ]
        }
    },
    shopsDictionary: {
        '1': {
            shopName: 'Stupid Shop 1',
            profits: 2000,
            revenue: 50000,
            branches: 1
        },
        '2': {
            shopName: 'Stupid Shop 2',
            profits: -2000,
            revenue: 8000,
            branches: 4
        },
        '3': {
            shopName: 'Wrogn',
            profits: 2000000,
            revenue: 9000000,
            branches: 374
        },
        '4': {
            shopName: 'One 8',
            profits: 400000,
            revenue: 8000000,
            branches: 146
        }
    }
}

app.get('/vulnerable', (req, res) => {
    sess = req.session
    var htmlString = ' <form action="/vulnerable/login" method="post"><label for="uname"><b>Username</b></label><input type="text" placeholder="Enter Username" name="uname" required><br><label for="psw"><b>Password</b></label><input type="password" placeholder="Enter Password" name="psw" required><br><button type="submit">Login</button></div></form> '
    res.send(htmlString)
})

app.get('/vulnerable/shopDetails/:shopId', (req, res) => {

    var htmlString = ''
    var shopId = req.params.shopId
    var shopObj = database.shopsDictionary[shopId]
    htmlString = '<h3>Shop Details</h3>'
    htmlString += '<p>Name: ' + shopObj.shopName + '</p>'
    htmlString += '<p>Profits: ' + shopObj.profits + '</p>'
    htmlString += '<p>Revenue: ' + shopObj.revenue + '</p>'
    htmlString += '<p>Branches: ' + shopObj.branches + '</p>'

    // if(database.userDetails[sess.loggedUserId].shopList.find(elm => elm == shopId)){
    //     var shopObj = database.shopsDictionary[shopId]
    //     htmlString = '<h3>Shop Details</h3>'
    //     htmlString += '<p>Name: ' + shopObj.shopName + '</p>'
    //     htmlString += '<p>Profits: ' + shopObj.profits + '</p>'
    //     htmlString += '<p>Revenue: ' + shopObj.revenue + '</p>'
    //     htmlString += '<p>Branches: ' + shopObj.branches + '</p>'
    // }else{
    //     htmlString = '<h1>Unauthorized Access</h1>'
    // }
    /*
        * Above part of the code checks for the user id logged in.
        * Every time the details of a shop are tried to access, a check is made as to whether it actually belongs to him.
    */

    
    res.send(htmlString)
})

app.post('/vulnerable/login', (req, res) => {
    var username = req.body.uname
    var password = req.body.psw

    if(database.logins[username]){
        if(password == database.logins[username].password){
            sess.loggedUserId = database.logins[username].userId
            var userId = database.logins[username].userId
            var userObj = database.userDetails[userId]
            var htmlString = '<h3>Login Success. Welcome ' + userObj.name + '</h3>'
            htmlString += '<p>Shops List</p><ol>'
            userObj.shops.forEach(shop => {
                htmlString += '<li><a href="/vulnerable/shopDetails/' + shop.shopId + '">' + shop.shopName + '</a></li>'
            });
            res.send(htmlString)
        }else{
            res.send('Invalid Username / Password')
        }
    }
    else{
        res.send('Invalid Username / Password')
    }
})


/*
    Below part is the secure code
*/


app.get('/secure', (req, res) => {
    sess = req.session
    var htmlString = ' <form action="/secure/login" method="post"><label for="uname"><b>Username</b></label><input type="text" placeholder="Enter Username" name="uname" required><br><label for="psw"><b>Password</b></label><input type="password" placeholder="Enter Password" name="psw" required><br><button type="submit">Login</button></div></form> '
    res.send(htmlString)
})

app.get('/secure/shopDetails/:shopId', (req, res) => {

    var htmlString = ''
    var shopId = req.params.shopId

    if(database.userDetails[sess.loggedUserId].shopList.find(elm => elm == shopId)){
        var shopObj = database.shopsDictionary[shopId]
        htmlString = '<h3>Shop Details</h3>'
        htmlString += '<p>Name: ' + shopObj.shopName + '</p>'
        htmlString += '<p>Profits: ' + shopObj.profits + '</p>'
        htmlString += '<p>Revenue: ' + shopObj.revenue + '</p>'
        htmlString += '<p>Branches: ' + shopObj.branches + '</p>'
    }else{
        htmlString = '<h1>Unauthorized Access</h1>'
    }
    /*
        * Above part of the code checks for the user id logged in.
        * Every time the details of a shop are tried to access, a check is made as to whether it actually belongs to him.
    */

    
    res.send(htmlString)
})

app.post('/secure/login', (req, res) => {
    var username = req.body.uname
    var password = req.body.psw

    if(database.logins[username]){
        if(password == database.logins[username].password){
            sess.loggedUserId = database.logins[username].userId
            var userId = database.logins[username].userId
            var userObj = database.userDetails[userId]
            var htmlString = '<h3>Login Success. Welcome ' + userObj.name + '</h3>'
            htmlString += '<p>Shops List</p><ol>'
            userObj.shops.forEach(shop => {
                htmlString += '<li><a href="/secure/shopDetails/' + shop.shopId + '">' + shop.shopName + '</a></li>'
            });
            res.send(htmlString)
        }else{
            res.send('Invalid Username / Password')
        }
    }
    else{
        res.send('Invalid Username / Password')
    }
})


app.listen(port, () => console.log(`Example App listening on port ${port}`))
