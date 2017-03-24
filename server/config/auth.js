// expose our config directly to our application using module.exports

module.exports = {
    'youtubeAuth' : {
        'clientID'  : '417156505976-ovujv3mk62jp7hf5r56upivpgg72pr2g.apps.googleusercontent.com',
        'clientSecret' : 'bVES3Z9_PyIkCHW803fonbPz',
        'callbackURL' : 'http://localhost:8080/auth/youtube/callback'
    },

    'facebookAuth' : {
        'clientID'  : 'secret client ID',
        'clientSecret' : 'client secret',
        'callbackURL' : 'http://localhost:8080/auth/facebook/callback'
      
    },
    
    'twitterAuth': {
        'clientID'  : 'secret client Id',
        'clientSecret' : 'client secret',
        'callbackURL' : 'http://localhost:8080/auth/twitter/callback'

    },

    'googleAuth' : {
        'clientID'  : 'id',
        'clientSecret' : 'secret',
        'callbackURL' : 'http://localhost:8080/auth/google/callback'
       
    }
};