const mongoClient       = require('../config/db');
const { ObjectId }      = require('mongodb');
const axios             = require('axios');
const Auth          = function(Auth) { };

Auth.getUserAccount = async (bodyData, dataProfile, result) => {
    if(
        (
            dataProfile.user.uuId==='' || 
            dataProfile.user.uuId===undefined || 
            dataProfile.user.uuId===null || 
            dataProfile.to.uuId==='' || 
            dataProfile.to.uuId===undefined || 
            dataProfile.to.uuId===null
        ) &&
        bodyData.userRoute !=='admin'
    ){
        result({status:500, message:"เกิดข้อผิดพลาดในการยืนยันตัวตน1", data:dataProfile });
        return;
    }

    try {
        let user = await mongoClient.collection('users').findOne({ uuId: bodyData.userRoute==='admin'?'admin-'+dataProfile.user.email:dataProfile.user.uuId });
        let to = await mongoClient.collection('users').findOne({ uuId: dataProfile.to.uuId });

        const dataUserInsert = [];
        
        if(!user){
            if(bodyData.userRoute==='admin'){

                dataUserInsert.push({
                    uuId        : 'admin-'+dataProfile.user.email,
                    fullnameTh  : dataProfile.user.name,
                    fullnameEn  : dataProfile.user.name,
                    email       : dataProfile.user.email,
                    image       : process.env.ENDPOINT_IMAGE+dataProfile.user.pictureProfilePath,
                    userType    : bodyData.userRoute,
                    status      : 0
                });

            }else{

                dataUserInsert.push({
                    uuId        : dataProfile.user.uuId,
                    fullnameTh  : dataProfile.user.fullnameTh,
                    fullnameEn  : dataProfile.user.fullnameEn,
                    email       : dataProfile.user.email,
                    image       : process.env.ENDPOINT_IMAGE+dataProfile.user.pictureProfilePath,
                    userType    : bodyData.userRoute,
                    status      : 0
                });

            }
        }

        if(!to){
            dataUserInsert.push({
                uuId        : dataProfile.to.uuId,
                fullnameTh  : dataProfile.to.fullnameTh,
                fullnameEn  : dataProfile.to.fullnameEn,
                email       : dataProfile.to.email,
                image       : process.env.ENDPOINT_IMAGE+dataProfile.to.pictureProfilePath,
                userType    : bodyData.type,
                status      : 0
            });
        }

        if(dataUserInsert.length){
            const userInsert = await mongoClient.collection('users').insertMany(dataUserInsert);
            if(userInsert.acknowledged===false || userInsert.insertedCount===0){
                result({status:500, message:"เกิดข้อผิดพลาดในการยืนยันตัวตน2", data:userInsert });
                return;
            }
            
            if(!user){
                user = await mongoClient.collection('users').findOne({ uuId: bodyData.userRoute==='admin'?'admin-'+dataProfile.user.email:dataProfile.user.uuId });
            }
            if(!to){
                to = await mongoClient.collection('users').findOne({ uuId: dataProfile.to.uuId });
            }
            
            result(null, {status:200, message:"ดึงข้อมูลเรียบร้อยแล้ว", data:{user: user, to: to}});
            return;
        }else{
            const updateUserProfile = await mongoClient.collection('users').updateOne(
                { uuId: bodyData.userRoute==='admin'?'admin-'+dataProfile.user.email:dataProfile.user.uuId },
                {
                    $set: {
                        fullnameTh  : bodyData.userRoute==='admin'?dataProfile.user.name:dataProfile.user.fullnameTh,
                        fullnameEn  : bodyData.userRoute==='admin'?dataProfile.user.name:dataProfile.user.fullnameEn,
                        email       : dataProfile.user.email,
                        image       : process.env.ENDPOINT_IMAGE+dataProfile.user.pictureProfilePath,
                        userType    : bodyData.userRoute
                    }
                }
            );
            
            if (updateUserProfile.modifiedCount === 1) {
                user = await mongoClient.collection('users').findOne({ uuId: bodyData.userRoute==='admin'?'admin-'+dataProfile.user.email:dataProfile.user.uuId });
            }
    
            result(null, {status:200, message:"ดึงข้อมูลเรียบร้อยแล้ว", data:{user: user, to: to}});
            return;
        }
        
    } catch (error) {
        result({status:500, message:"เกิดข้อผิดพลาดในการยืนยันตัวตน3", data:error });
        return;
    }
};

Auth.getUserProfile = async (bodyData, result) => {
    if(bodyData.__token==='' || bodyData.userRoute===''){
        result({status:500, message:"เกิดข้อผิดพลาดในการยืนยันตัวตน", data:bodyData });
        return;
    }
    
    try {
        let userProfile = await axios.request({
            method: 'post',
            url: process.env.ENDPOINT+process.env[`AUTH_${bodyData.userRoute.toUpperCase()}`],
            headers: { 
                'Authorization': `Bearer ${bodyData.__token}`
            }
        });

        if(bodyData.userRoute==='supplier'){
            userProfile = await axios.request({
                method: 'get',
                url: process.env.ENDPOINT+process.env[`UUID_${bodyData.userRoute.toUpperCase()}`]+`/${userProfile.data.uuId}`,
            });
        }

        const toProfile = await axios.request({
            method: 'get',
            url: process.env.ENDPOINT+process.env[`UUID_${bodyData.type.toUpperCase()}`]+`/${bodyData.__to}`,
        });


        result(null, {status:200, message:"ดึงข้อมูลเรียบร้อยแล้ว", user:userProfile.data, to:toProfile.data });
        return;

    } catch (error) {
        result({status:500, message:"เกิดข้อผิดพลาดในการยืนยันตัวตน", data:error });
        return;
    }
};

Auth.addContact = async (userId, contactUserId, result) => {

    const contactData = [
        {
            userId: userId,
            contactUserId: contactUserId,
            datetime: new Date(),
            lastMessage: '',
            messageFrom: '',
            messageTo: '',
            messageUpdate: new Date(),
            status: 1
        },
        {
            userId: contactUserId,
            contactUserId: userId,
            datetime: new Date(),
            lastMessage: '',
            messageFrom: '',
            messageTo: '',
            messageUpdate: new Date(),
            status: 1
        },
    ];

    try {
        const check = await mongoClient.collection('contacts').find({userId:userId, contactUserId:contactUserId}).toArray();
        
        if(!check.length){
            const res   = await mongoClient.collection('contacts').insertMany(contactData);
            if (!res.acknowledged) {
                result({ status: 500, message: "เกิดข้อผิดพลาดในการดำเนินการ", data: res });
                return;
            }
            result(null, { status: 200, message: "เพื่มข้อมูลเรียบร้อยแล้ว", data: res });
            return;
        }else{
            result(null, { status: 201, message: "มีรายชื่อผู้ติดต่ออยู่แล้ว", data: check });
            return;
        }

    } catch (err) {
        result({ status: 500, message: "เกิดข้อผิดพลาดในการดำเนินการ", data: err });
    }
};

module.exports = Auth;