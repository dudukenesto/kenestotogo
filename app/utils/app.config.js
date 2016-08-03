export const config = {
    env: { curEnv: 'dev'},
    urls: [{ env : 'dev',
         ApiBaseUrl : 'http://10.0.0.104/Kenesto.Web.API/', 
         AuthUrlTemplate: 'http://10.0.0.104/Kenesto.Web.API/Access.svc/Authenticate/json/null?u={0}&p={1}',
         LoginUrlTemplate: 'http://10.0.0.104/Kenesto.Web.API/Access.svc/Login/json/{0}?t={1}',
         ForgotPasswordUrl: 'http://10.0.0.104/Kenesto.Web.API/Access.svc/ForgotPassword/json?u={0}'
    },          
    {
         env : 'devDudu',
         ApiBaseUrl : 'http://10.0.0.104/Kenesto.Web.API/', 
         AuthUrlTemplate: 'http://10.0.0.104/Kenesto.Web.API/Access.svc/Authenticate/json/null?u={0}&p={1}',
         LoginUrlTemplate: 'http://10.0.0.104/Kenesto.Web.API/Access.svc/Login/json/{0}?t={1}',
         ForgotPasswordUrl: 'http://10.0.0.104/Kenesto.Web.API/Access.svc/ForgotPassword/json?u={0}'
         
    },
    {
        env : 'devDudu',
         ApiBaseUrl : 'http://10.0.0.118/Kenesto.Web.API/', 
         AuthUrlTemplate: 'http://10.0.0.118/Kenesto.Web.API/Access.svc/Authenticate/json/null?u={0}&p={1}',
         LoginUrlTemplate: 'http://10.0.0.118/Kenesto.Web.API/Access.svc/Login/json/{0}?t={1}',
         ForgotPasswordUrl: 'http://10.0.0.118/Kenesto.Web.API/Access.svc/ForgotPassword/json?u={0}'
         
    },
   {
        env : 'devKonstya',
         ApiBaseUrl : 'http://10.0.0.124/Kenesto.Web.API/', 
         AuthUrlTemplate: 'http://10.0.0.124/Kenesto.Web.API/Access.svc/Authenticate/json/null?u={0}&p={1}',
         LoginUrlTemplate: 'http://10.0.0.124/Kenesto.Web.API/Access.svc/Login/json/{0}?t={1}',
         ForgotPasswordUrl: 'http://10.0.0.124/Kenesto.Web.API/Access.svc/ForgotPassword/json?u={0}'
         
    },
   {
        env : 'qa',
         ApiBaseUrl : 'http://10.0.0.117/Kenesto.Web.API/', 
         AuthUrlTemplate: 'http://10.0.0.117/Kenesto.Web.API/Access.svc/Authenticate/json/null?u={0}&p={1}',
         LoginUrlTemplate: 'http://10.0.0.117/Kenesto.Web.API/Access.svc/Login/json/{0}?t={1}',
         ForgotPasswordUrl: 'http://10.0.0.104/Kenesto.Web.API/Access.svc/ForgotPassword/json?u={0}'
        
    },
    {
          env : 'production',
         ApiBaseUrl : 'https://stage-app.kenesto.com/kenesto.web.api/', 
         AuthUrlTemplate: 'https://stage-app.kenesto.com/kenesto.web.api/access.svc/Authenticate/json/null?u={0}&p={1}',
         LoginUrlTemplate: 'https://stage-app.kenesto.com/kenesto.web.api/access.svc/Login/json/{0}?t={1}',
         ForgotPasswordUrl: 'https://stage-app.kenesto.com/Kenesto.Web.API/Access.svc/ForgotPassword/json?u={0}'
        
    },
     {
         env : 'production',    
         ApiBaseUrl : 'https://stage-app.kenesto.com/kenesto.web.api/', 
         AuthUrlTemplate: 'https://stage-app.kenesto.com/kenesto.web.api/access.svc/Authenticate/json/null?u={0}&p={1}',
         LoginUrlTemplate: 'https://stage-app.kenesto.com/kenesto.web.api/access.svc/Login/json/{0}?t={1}',
         ForgotPasswordUrl: 'https://stage-app.kenesto.com/Kenesto.Web.API/Access.svc/ForgotPassword/json?u={0}'
        
    }
    ]
}





   


