# Blog
My first completed project , you can see at : https://phong-kaster.github.io/Blog.io/

First of all, I'm thankful for Nguyen Dang Hau (@ngdanghau) - he is my best friend , my great teacher.
And he helped me to do and learn many fabulous things about this topic.
e
You can reference his works from here : https://github.com/ngdanghau.

As of now , this is my first completed project in my life with NodeJS , Express , MongoDB & Mongoose.

Actually , when i finished this project.Such an interesting project that i have done , my experience makes process a lot.However, this is the first project so that it is a absolute mess.
Every single router do not follow any famous structure like Model-View-Controller , Model-View-Presenter or Model–View–ViewModel.....You should reference if you are a newcomer , not for advanced developers.

To begin start,open your integrated terminal and run
  
        npm install
        
To begin server , hit and run

        npm start
        
 
In this project, I have a simple website spider that could crawl posts from tinhte.vn automactically.To use up , I used pm2 package.You can read more at : https://www.npmjs.com/package/pm2

So that , to run both website spider and server , run


        pm2 start app.js
        
        pm2 start automatic.js
        
        
And you will see in the terminal
![image](https://user-images.githubusercontent.com/58034430/122628177-e3513800-d0de-11eb-9d88-efa3aeff1b17.png)

To end server , open terminal and hit

        pm2 stop all

And another important thing is a database,my MongoDB have tables :

1) articles
2) categories
3) comments
4) menus
5) roles
6) users


I don't know you and you don't know me. Probably we are not even living in the same country. We look different. We speak different languages. Maybe we are from entirely different generations. We are just complete strangers.

But there is something that connects us. We both have great taste in getting programming

Thank you for being here. God bless you, whoever you are

========
Begun on 9th March 2021 & Finished on 9h11 , 23th April 2021 ========
