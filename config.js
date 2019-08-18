var environments={};

//default environment
environments.staging={
    'httpPort':3000,
    'httpsPort':3001,
    'envName':'staging'
};

//prod
environments.production={
    'httpPort':5000,
    'httpsPort':5001,
    'envName':'production'
};

//setting default to staging
var currEnv=typeof(process.env.NODE_ENV)=='string'?process.env.NODE_ENV.toLowerCase():'staging';

//sanity check
var envToExport=typeof(environments[currEnv])=='object'?environments[currEnv]:environments.staging;

module.exports=envToExport;