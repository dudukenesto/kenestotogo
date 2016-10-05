export const config = {
    env: { curEnv: 'dev'},
    urls: [{ env : 'dev',
         Ip: '10.0.0.125',
         ApiBaseUrl : 'http://10.0.0.125/Kenesto.Web.API/', 
         AuthUrlTemplate: 'http://10.0.0.125/Kenesto.Web.API/Access.svc/Authenticate/json/null?u={0}&p={1}',
         LoginUrlTemplate: 'http://10.0.0.125/Kenesto.Web.API/Access.svc/Login/json/{0}?t={1}',
         ForgotPasswordUrl: 'http://10.0.0.125/Kenesto.Web.API/Access.svc/ForgotPassword/json?u={0}',
    },          
    {
         env : 'devDudu',
         Ip: '10.0.0.125',
         ApiBaseUrl : 'http://10.0.0.125/Kenesto.Web.API/', 
         AuthUrlTemplate: 'http://10.0.0.125/Kenesto.Web.API/Access.svc/Authenticate/json/null?u={0}&p={1}',
         LoginUrlTemplate: 'http://10.0.0.125/Kenesto.Web.API/Access.svc/Login/json/{0}?t={1}',
         ForgotPasswordUrl: 'http://10.0.0.125/Kenesto.Web.API/Access.svc/ForgotPassword/json?u={0}',
         
    },
    {
        env : 'devAdam',
         Ip: '10.0.0.118',
         ApiBaseUrl : 'http://10.0.0.118/Kenesto.Web.API/', 
         AuthUrlTemplate: 'http://10.0.0.118/Kenesto.Web.API/Access.svc/Authenticate/json/null?u={0}&p={1}',
         LoginUrlTemplate: 'http://10.0.0.118/Kenesto.Web.API/Access.svc/Login/json/{0}?t={1}',
         ForgotPasswordUrl: 'http://10.0.0.118/Kenesto.Web.API/Access.svc/ForgotPassword/json?u={0}',
         
    },
   {
        env : 'devKonstya',
         Ip: '10.0.0.124',
         ApiBaseUrl : 'http://10.0.0.124/Kenesto.Web.API/', 
         AuthUrlTemplate: 'http://10.0.0.124/Kenesto.Web.API/Access.svc/Authenticate/json/null?u={0}&p={1}',
         LoginUrlTemplate: 'http://10.0.0.124/Kenesto.Web.API/Access.svc/Login/json/{0}?t={1}',
         ForgotPasswordUrl: 'http://10.0.0.124/Kenesto.Web.API/Access.svc/ForgotPassword/json?u={0}',
         
    },
   {
        env : 'qa',
         Ip: '10.0.0.117',
         ApiBaseUrl : 'http://10.0.0.117/Kenesto.Web.API/', 
         AuthUrlTemplate: 'http://10.0.0.117/Kenesto.Web.API/Access.svc/Authenticate/json/null?u={0}&p={1}',
         LoginUrlTemplate: 'http://10.0.0.117/Kenesto.Web.API/Access.svc/Login/json/{0}?t={1}',
         ForgotPasswordUrl: 'http://10.0.0.117/Kenesto.Web.API/Access.svc/ForgotPassword/json?u={0}',
        
    },
    {
          env : 'production',
          Ip: '50.17.185.8',
         ApiBaseUrl : 'https://stage-app.kenesto.com/kenesto.web.api/', 
         AuthUrlTemplate: 'https://stage-app.kenesto.com/kenesto.web.api/access.svc/Authenticate/json/null?u={0}&p={1}',
         LoginUrlTemplate: 'https://stage-app.kenesto.com/kenesto.web.api/access.svc/Login/json/{0}?t={1}',
         ForgotPasswordUrl: 'https://stage-app.kenesto.com/Kenesto.Web.API/Access.svc/ForgotPassword/json?u={0}',
        
    },
     {
         env : 'production',  
         Ip: '50.17.185.8', 
         ApiBaseUrl : 'https://stage-app.kenesto.com/kenesto.web.api/', 
         AuthUrlTemplate: 'https://stage-app.kenesto.com/kenesto.web.api/access.svc/Authenticate/json/null?u={0}&p={1}',
         LoginUrlTemplate: 'https://stage-app.kenesto.com/kenesto.web.api/access.svc/Login/json/{0}?t={1}',
         ForgotPasswordUrl: 'https://stage-app.kenesto.com/Kenesto.Web.API/Access.svc/ForgotPassword/json?u={0}',
        
    }
    ]
}





   


