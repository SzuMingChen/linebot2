module.exports = (app)=>{
    require('./user')(app);
    require('./admin')(app);
    require('./order')(app);
    require('./record')(app);
}