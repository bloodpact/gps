const passport = require('passport');
const YandexTokenStrategy = require('passport-yandex-token');

module.exports = function(passport){
    passport.use(new YandexTokenStrategy({
        clientID: '32be4d693fa946d495cd3aa9c9d840d0',
        clientSecret: '5c0228f5d78c4695a2e0f26cb14ae77f',
        callbackURL: "https://oauth.yandex.ru/verification_code"
    }, function(req, accessToken, refreshToken, profile, next) {
        console.log(accessToken)
        User.findOrCreate({'yandex.id': profile.id}, function(error, user) {
            console.log(user)
            return next(error, user);
        });
    }));
}