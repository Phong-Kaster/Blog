# Blog
My first completed project

First of all, I'm thankful for Nguyen Dang Hau (@ngdanghau) - he is my best friend , my great teacher.
And he helped me to do and learn many fabulous things about this topic.

You can reference his works from here : https://github.com/ngdanghau.

As of now , this is my first completed project in my life with NodeJS , Express , MongoDB & Mongoose.

Actually , when i finish this project.Such an interesting project that i have done , my experience makes process a lot.However, this is the first project so that it is a absolute mess.
Every single router do not follow any famous structure like Model-View-Controller , Model-View-Presenter or Model–View–ViewModel.....You should reference if you are a newcomer , not for advanced developers.

To begin start,open your integrated terminal and run
  
        npm install
        
To begin server , run now
        npm start
        
 
In this project, I have a simple website spider that could crawl posts from tinhte.vn automactically.To use up , I used pm2 package.You can read more at : https://www.npmjs.com/package/pm2

So that , to run both website spider and server , run


        pm2 start app.js
        
        pm2 start automatic.js
        
        
And you will see in the terminal
