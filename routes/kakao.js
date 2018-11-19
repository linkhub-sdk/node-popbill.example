var express = require('express');
var router = express.Router();
var popbill = require('popbill');

/**
 * 팝빌 서비스 연동환경 초기화
 */
popbill.config({

    // 링크아이디
    LinkID: 'TESTER',

    // 비밀키
    SecretKey: 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=',

    // 연동환경 설정값, 개발용(true), 상업용(false)
    IsTest: true,

    defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

/**
 * 카카오톡 API 서비스 클래스 생성
 */
var kakaoService = popbill.KakaoService();

// Kakao API List Index
router.get('/', function (req, res, next) {
    res.render('Kakao/index', {});
});

/**
 * 플러스친구 계정관리 팝업 URL을 반환합니다.
 * - 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
 */
router.get('/getURL_PLUSFRIEND', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌 회원아이디
    var UserID = 'testkorea';

    // 플러스친구계정관리(PLUSFRINED) / 발신번호관리(SENDER) / 알림톡템플릿관리(TEMPLATE) / 카카오톡전송내역(BOX)
    var TOGO = 'PLUSFRIEND';

    kakaoService.getURL(testCorpNum, TOGO, UserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 팝빌에 등록된 플러스친구 목록을 반환 합니다.
 */
router.get('/listPlusFriendID', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌 회원아이디
    var UserID = 'testkorea';

    kakaoService.listPlusFriendID(testCorpNum, UserID,
        function (response) {
            res.render('Kakao/listPlusFriendID', {path: req.path, result: response});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 발신번호 관리 팝업 URL을 반환합니다.
 * - 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
 */
router.get('/getURL_SENDER', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌 회원아이디
    var UserID = 'testkorea';

    // 플러스친구계정관리(PLUSFRINED) / 발신번호관리(SENDER) / 알림톡템플릿관리(TEMPLATE) / 카카오톡전송내역(BOX)
    var TOGO = 'SENDER';

    kakaoService.getURL(testCorpNum, TOGO, UserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 팝빌에 등록된 발신번호 목록을 확인합니다.
 */
router.get('/getSenderNumberList', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌 회원아이디
    var UserID = 'testkorea';

    kakaoService.getSenderNumberList(testCorpNum, UserID,
        function (response) {
            res.render('Kakao/getSenderNumberList', {path: req.path, result: response});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 알림톡 템플릿 관리 팝업 URL을 반환합니다.
 * - 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
 */
router.get('/getURL_TEMPLATE', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌 회원아이디
    var UserID = 'testkorea';

    // 플러스친구계정관리(PLUSFRINED) / 발신번호관리(SENDER) / 알림톡템플릿관리(TEMPLATE) / 카카오톡전송내역(BOX)
    var TOGO = 'TEMPLATE';

    kakaoService.getURL(testCorpNum, TOGO, UserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * (주)카카오로 부터 승인된 알림톡 템플릿 목록을 확인 합니다.
 */
router.get('/listATSTemplate', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌 회원아이디
    var UserID = 'testkorea';

    kakaoService.listATSTemplate(testCorpNum, UserID,
        function (response) {
            res.render('Kakao/listATSTemplate', {path: req.path, result: response});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 단건의 알림톡을 전송합니다.
 */
router.get('/sendATS_one', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 알림톡 템플릿코드
    // 승인된 알림톡 템플릿 코드는 ListATStemplate API, GetURL(TEMPLATE) API, 혹은 팝빌사이트에서 확인이 가능합니다.
    var templateCode = '018080000079';

    // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
    var snd = '070-4304-2992';

    // 알림톡 내용 (최대 1000자)
    var content = '테스트 템플릿 입니다.';

    // 대체문자 내용 (최대 2000byte)
    var altContent = '알림톡 대체 문자';

    // 대체문자 유형 [공백-미전송, C-알림톡내용, A-대체문자내용]
    var altSendType = 'A';

    // 예약일시 (작성일시 : yyyyMMddHHmmss)
    var sndDT = '';

    // 수신번호
    var receiver = '010111222';

    // 수신자 이름
    var receiverName = 'partner';

    // 팝빌회원 아이디
    var UserID = 'testkorea';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    kakaoService.sendATS_one(testCorpNum, templateCode, snd, content, altContent, altSendType, sndDT, receiver, receiverName, UserID, requestNum,
        function (receiptNum) {
            res.render('Kakao/receiptNum', {path: req.path, receiptNum: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 동일한 내용의 알림톡을 대량 전송 합니다.
 */
router.get('/sendATS_same', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 알림톡 템플릿코드
    // 승인된 알림톡 템플릿 코드는 ListATStemplate API, GetURL(TEMPLATE) API, 혹은 팝빌사이트에서 확인이 가능합니다.
    var templateCode = '018080000079';

    // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
    var snd = '070-4304-2992';

    // 알림톡 내용 (최대 1000자)
    var content = '테스트 템플릿 입니다.';

    // 대체문자 내용 (최대 2000byte)
    var altContent = '알림톡 동보 대체 문자';

    // 대체문자 유형 [공백-미전송, C-알림톡내용, A-대체문자내용]
    var altSendType = 'A';

    // 예약일시 (작성일시 : yyyyMMddHHmmss)
    var sndDT = '';

    // [배열] 알림톡 전송정보 (최대 1000개)
    var msgs = [
        {
            rcv: '010111222',   //수신번호
            rcvnm: 'popbill'    //수신자명
        },
        {
            rcv: '010111222',
            rcvnm: 'linkhub'
        }
    ];

    // 팝빌회원 아이디
    var UserID = 'testkorea';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    kakaoService.sendATS_same(testCorpNum, templateCode, snd, content, altContent, altSendType, sndDT, msgs, UserID, requestNum,
        function (receiptNum) {
            res.render('Kakao/receiptNum', {path: req.path, receiptNum: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 개별 내용의 알림톡을 대량 전송 합니다.
 */
router.get('/sendATS_multi', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 알림톡 템플릿코드
    // 승인된 알림톡 템플릿 코드는 ListATStemplate API, GetURL(TEMPLATE) API, 혹은 팝빌사이트에서 확인이 가능합니다.
    var templateCode = '018080000079';

    // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
    var snd = '070-4304-2992';

    // 대체문자 유형 [공백-미전송, C-알림톡내용, A-대체문자내용]
    var altSendType = 'A';

    // 예약일시 (작성일시 : yyyyMMddHHmmss)
    var sndDT = '';

    // [배열] 알림톡 전송정보 (최대 1000개)
    var msgs = [
        {
            rcv: '010111222',           //수신번호
            rcvnm: 'popbill',           //수신자명
            msg: '테스트 템플릿 입니다.',    //알림톡 내용
            altmsg: '알림톡 대체 문자_0'    //대체문자 내용
        },
        {
            rcv: '010111222',
            rcvnm: 'linkhub',
            msg: '테스트 템플릿 입니다1',
            altmsg: '알림톡 대체 문자_1'
        }
    ];

    // 팝빌회원 아이디
    var UserID = 'testkorea';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    kakaoService.sendATS_multi(testCorpNum, templateCode, snd, altSendType, sndDT, msgs, UserID, requestNum,
        function (receiptNum) {
            res.render('Kakao/receiptNum', {path: req.path, receiptNum: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 단건의 친구톡 텍스트를 전송합니다.
 */
router.get('/sendFTS_one', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌에 등록된 플러스 친구 아이디
    var plusFriendID = '@팝빌';

    // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
    var snd = '070-4304-2992';

    // 친구톡 내용 (최대 1000자)
    var content = '친구톡 내용.';

    // 대체문자 내용 (최대 2000byte)
    var altContent = '친구톡 대체 문자';

    // 대체문자 유형 [공백-미전송, C-친구톡내용, A-대체문자내용]
    var altSendType = 'A';

    // 예약일시 (작성일시 : yyyyMMddHHmmss)
    var sndDT = '';

    // 수신번호
    var receiver = '010111222';

    // 수신자 이름
    var receiverName = 'partner';

    // 광고여부 (true / false)
    var adsYN = false;

    // [배열] 버튼 목록 (최대 5개)
    var btns = [
        {
            n: '팝빌 바로가기',               //버튼명
            t: 'WL',                      //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
            u1: 'http://www.popbill.com', //[앱링크-Android, 웹링크-Mobile]
            u2: 'http://www.popbill.com'  //[앱링크-IOS, 웹링크-PC URL]
        }
    ];

    // 팝빌회원 아이디
    var UserID = 'testkorea';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    kakaoService.sendFTS_one(testCorpNum, plusFriendID, snd, content, altContent, altSendType, sndDT, receiver, receiverName, adsYN, btns, UserID, requestNum,
        function (receiptNum) {
            res.render('Kakao/receiptNum', {path: req.path, receiptNum: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 동일한 내용의 친구톡 텍스트를 대량 전송 합니다.
 */
router.get('/sendFTS_same', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌에 등록된 플러스 친구 아이디
    var plusFriendID = '@팝빌';

    // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
    var snd = '070-4304-2992';

    // 친구톡 내용 (최대 1000자)
    var content = '친구톡 내용.';

    // 대체문자 내용 (최대 2000byte)
    var altContent = '친구톡 대체 문자';

    // 대체문자 유형 [공백-미전송, C-친구톡내용, A-대체문자내용]
    var altSendType = 'A';

    // 예약일시 (작성일시 : yyyyMMddHHmmss)
    var sndDT = '';

    // 광고여부 (true / false)
    var adsYN = false;

    // [배열] 친구톡 전송정보 (최대 1000개)
    var msgs = [
        {
            rcv: '010111222',       //수신번호
            rcvnm: 'popbill'        //수신자명
        },
        {
            rcv: '010111222',
            rcvnm: 'linkhub'
        }
    ];

    // [배열] 버튼 목록 (최대 5개)
    var btns = [
        {
            n: '팝빌 바로가기',              //버튼명
            t: 'WL',                      //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
            u1: 'http://www.popbill.com', //[앱링크-Android, 웹링크-Mobile]
            u2: 'http://www.popbill.com'  //[앱링크-IOS, 웹링크-PC URL]
        }
    ];

    // 팝빌회원 아이디
    var UserID = 'testkorea';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    kakaoService.sendFTS_same(testCorpNum, plusFriendID, snd, content, altContent, altSendType, sndDT, adsYN, msgs, btns, UserID, requestNum,
        function (receiptNum) {
            res.render('Kakao/receiptNum', {path: req.path, receiptNum: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 개별 내용의 친구톡 텍스트를 전송 합니다.
 */
router.get('/sendFTS_multi', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌에 등록된 플러스 친구 아이디
    var plusFriendID = '@팝빌';

    // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
    var snd = '070-4304-2992';

    // 대체문자 유형 [공백-미전송, C-친구톡내용, A-대체문자내용]
    var altSendType = 'A';

    // 예약일시 (작성일시 : yyyyMMddHHmmss)
    var sndDT = '';

    // 광고여부 (true / false)
    var adsYN = false;

    // [배열] 친구톡 전송정보 (최대 1000개)
    var msgs = [
        {
            rcv: '010111222',           //수신번호
            rcvnm: 'popbill',           //수신자명
            msg: '테스트 템플릿 입니다.',    //친구톡 내용
            altmsg: '친구톡 대체 문자_0'    //대체문자 내용
        },
        {
            rcv: '010111222',
            rcvnm: 'linkhub',
            msg: '테스트 템플릿 입니다1',
            altmsg: '친구톡 대체 문자_1'
        }
    ];

    // [배열] 버튼 목록 (최대 5개)
    var btns = [
        {
            n: '팝빌 바로가기',              //버튼명
            t: 'WL',                      //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
            u1: 'http://www.popbill.com', //[앱링크-Android, 웹링크-Mobile]
            u2: 'http://www.popbill.com'  //[앱링크-IOS, 웹링크-PC URL]
        }
    ];

    // 팝빌회원 아이디
    var UserID = 'testkorea';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    kakaoService.sendFTS_multi(testCorpNum, plusFriendID, snd, altSendType, sndDT, adsYN, msgs, btns, UserID, requestNum,
        function (receiptNum) {
            res.render('Kakao/receiptNum', {path: req.path, receiptNum: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 단건의 친구톡 이미지를 전송합니다.
 */
router.get('/sendFMS_one', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌에 등록된 플러스 친구 아이디
    var plusFriendID = '@팝빌';

    // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
    var snd = '070-4304-2992';

    // 친구톡 내용 (최대 400자)
    var content = '친구톡 내용.';

    // 대체문자 내용 (최대 2000byte)
    var altContent = '친구톡 대체 문자';

    // 대체문자 유형 [공백-미전송, C-친구톡내용, A-대체문자내용]
    var altSendType = 'A';

    // 예약일시 (작성일시 : yyyyMMddHHmmss)
    var sndDT = '';

    // 수신번호
    var receiver = '010111222';

    // 수신자 이름
    var receiverName = 'partner';

    // 광고여부 (true / false)
    var adsYN = false;

    // 친구톡 이미지 링크 URL
    var imageURL = 'http://www.linkhun.co.kr';

    // 파일경로
    // 이미지 전송 규격 (전송포맷-JPG,JPEG / 용량제한-최대 500Kbte / 이미지 높이/너비 비율 : 1.333 이하, 1/2 이상)
    var filePath = ['./fmsImage.jpg'];

    // [배열] 버튼 목록 (최대 5개)
    var btns = [
        {
            n: '팝빌 바로가기',              //버튼명
            t: 'WL',                      //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
            u1: 'http://www.popbill.com', //[앱링크-Android, 웹링크-Mobile]
            u2: 'http://www.popbill.com'  //[앱링크-IOS, 웹링크-PC URL]
        }
    ];

    // 팝빌회원 아이디
    var UserID = 'testkorea';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    kakaoService.sendFMS_one(testCorpNum, plusFriendID, snd, content, altContent, altSendType, sndDT, receiver, receiverName, adsYN, imageURL, filePath, btns, UserID, requestNum,
        function (receiptNum) {
            res.render('Kakao/receiptNum', {path: req.path, receiptNum: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 동일한 내용의 친구톡 이미지를 대량 전송 합니다.
 */
router.get('/sendFMS_same', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌에 등록된 플러스 친구 아이디
    var plusFriendID = '@팝빌';

    // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
    var snd = '070-4304-2992';

    // 친구톡 내용 (최대 400자)
    var content = '친구톡 내용.';

    // 대체문자 내용 (최대 2000byte)
    var altContent = '친구톡 대체 문자';

    // 대체문자 유형 [공백-미전송, C-친구톡내용, A-대체문자내용]
    var altSendType = 'A';

    // 예약일시 (작성일시 : yyyyMMddHHmmss)
    var sndDT = '';

    // 광고여부 (true / false)
    var adsYN = false;

    // 친구톡 이미지 링크 URL
    var imageURL = 'http://www.linkhun.co.kr';

    // 파일경로
    // 이미지 전송 규격 (전송포맷-JPG,JPEG / 용량제한-최대 500Kbte / 이미지 높이/너비 비율 : 1.333 이하, 1/2 이상)
    var filePath = ['./fmsImage.jpg'];

    // [배열] 친구톡 전송정보 (최대 1000개)
    var msgs = [
        {
            rcv: '010111222',   //수신번호
            rcvnm: 'popbill'    //수신자명
        },
        {
            rcv: '010111222',
            rcvnm: 'linkhub'
        }
    ];

    // [배열] 버튼 목록 (최대 5개)
    var btns = [
        {
            n: '팝빌 바로가기',               //버튼명
            t: 'WL',                      //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
            u1: 'http://www.popbill.com', //[앱링크-Android, 웹링크-Mobile]
            u2: 'http://www.popbill.com'  //[앱링크-IOS, 웹링크-PC URL]
        }
    ];

    // 팝빌회원 아이디
    var UserID = 'testkorea';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    kakaoService.sendFMS_same(testCorpNum, plusFriendID, snd, content, altContent, altSendType, sndDT, adsYN, imageURL, filePath, msgs, btns, UserID, requestNum,
        function (receiptNum) {
            res.render('Kakao/receiptNum', {path: req.path, receiptNum: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 개별 내용의 친구톡 이미지를 전송 합니다.
 */
router.get('/sendFMS_multi', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌에 등록된 플러스 친구 아이디
    var plusFriendID = '@팝빌';

    // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
    var snd = '070-4304-2992';

    // 대체문자 유형 [공백-미전송, C-친구톡내용, A-대체문자내용]
    var altSendType = 'A';

    // 예약일시 (작성일시 : yyyyMMddHHmmss)
    var sndDT = '';

    // 광고여부 (true / false)
    var adsYN = false;

    // 친구톡 이미지 링크 URL
    var imageURL = 'http://www.linkhun.co.kr';

    // 파일경로
    // 이미지 전송 규격 (전송포맷-JPG,JPEG / 용량제한-최대 500Kbte / 이미지 높이/너비 비율 : 1.333 이하, 1/2 이상)
    var filePath = ['./fmsImage.jpg'];

    // [배열] 친구톡 전송정보 (최대 1000개)
    var msgs = [
        {
            rcv: '010111222',           //수신번호
            rcvnm: 'popbill',           //수신자명
            msg: '친구톡 이미지 입니다_0',   //친구톡 내용 (최대 400자)
            altmsg: '친구톡 대체 문자_0'    //대체문자 내용 (최대 2000byte)
        },
        {
            rcv: '010111222',
            rcvnm: 'linkhub',
            msg: '친구톡 이미지 입니다_0',
            altmsg: '친구톡 대체 문자_1'
        }
    ];

    // [배열] 버튼 목록 (최대 5개)
    var btns = [
        {
            n: '팝빌 바로가기',               //버튼명
            t: 'WL',                      //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
            u1: 'http://www.popbill.com', //[앱링크-Android, 웹링크-Mobile]
            u2: 'http://www.popbill.com'  //[앱링크-IOS, 웹링크-PC URL]
        }
    ];

    // 팝빌회원 아이디
    var UserID = 'testkorea';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    kakaoService.sendFMS_multi(testCorpNum, plusFriendID, snd, altSendType, sndDT, adsYN, imageURL, filePath, msgs, btns, UserID, requestNum,
        function (receiptNum) {
            res.render('Kakao/receiptNum', {path: req.path, receiptNum: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 알림톡/친구톡 예약전송을 취소합니다.
 * - 예약취소는 예약전송시간 10분전까지만 가능합니다.
 */
router.get('/cancelReserve', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 예약 알림톡/친구톡 전송 접수번호
    var receiptNum = '018040509201400001';

    // 팝빌회원 아이디
    var UserID = 'testkorea';

    kakaoService.cancelReserve(testCorpNum, receiptNum, UserID,
        function (response) {
            res.render('response', {path: req.path, code: response.code, message: response.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 전송요청번호(requestNum)를 할당한 알림톡/친구톡 예약전송건을 취소합니다.
 * - 예약전송 취소는 예약시간 10분전까지만 가능합니다.
 */
router.get('/cancelReserveRN', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 예약 알림톡/친구톡 전송 요청번호
    var requestNum = '20180928111311';

    // 팝빌회원 아이디
    var UserID = 'testkorea';

    kakaoService.cancelReserveRN(testCorpNum, requestNum, UserID,
        function (response) {
            res.render('response', {path: req.path, code: response.code, message: response.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 알림톡/친구톡 전송내역 및 전송상태를 확인 합니다.
 */
router.get('/getMessages', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 카카오톡 접수번호
    var receiptNum = '018040513330800001';

    // 팝빌회원 아이디
    var UserID = 'testkorea';

    kakaoService.getMessages(testCorpNum, receiptNum, UserID,
        function (response) {
            res.render('Kakao/getMessages', {path: req.path, result: response});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 전송요청번호(requestNum)를 할당한 알림톡/친구톡 전송내역 및 전송상태를 확인한다.
 */
router.get('/getMessagesRN', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 카카오톡 요청번호
    var requestNum = '20180903144355';

    // 팝빌회원 아이디
    var UserID = 'testkorea';

    kakaoService.getMessagesRN(testCorpNum, requestNum, UserID,
        function (response) {
            res.render('Kakao/getMessages', {path: req.path, result: response});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/**
 * 알림톡/친구톡 전송내역 목록을 조회를 합니다.
 * - 버튼정보를 확인 하는 경우 GetMessages API를 사용
 * - 최대 검색기간 : 6개월 이내
 */
router.get('/search', function (req, res, next) {

    // 팝빌회원 사업자 번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 시작일자, 표시형식 (yyyyMMdd)
    var sDate = '20180901';

    // 종료일자, 표시형식 (yyyyMMdd)
    var eDate = '20180930';

    // [배열] 전송상태 ( 0-대기 / 1-전송중 / 2-성공 / 3-대체 / 4-실패 / 5-취소)
    var state = [0, 1, 2, 3, 4, 5];

    // [배열] 검색대상 ( ATS-알림톡 / FTS-친구톡텍스트 / FMS-친구톡이미지 )
    var item = ['ATS', 'FTS', 'FMS'];

    // 예약여부 ( 공백-전체조회 / 1-예약전송조회 / 0-즉시전송조회)
    var reserveYN = '';

    // 개인조회여부 ( ture-개인조회 / false-전체조회)
    var senderYN = true;

    // 페이지 번호, 기본값 1
    var page = 1;

    // 페이지당 검색개수, 기본값 500, 최대값 1000
    var perPage = 10;

    // 정렬방향 ( D-내림차순 / A-오름차순 ) 기본값 D
    var order = 'D';

    // 조회 검색어.
    // 카카오톡 전송시 입력한 수신자명 기재.
    // 조회 검색어를 포함한 수신자명을 검색합니다.
    var QString = '';

    // 팝빌 회원아이디
    var UserID = 'testkorea';

    kakaoService.search(testCorpNum, sDate, eDate, state, item, reserveYN, senderYN, page, perPage, order, QString, UserID,
        function (response) {
            res.render('Kakao/search', {path: req.path, result: response});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 카카오톡 전송내역 팝업 URL을 반환합니다.
 * - 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
 */
router.get('/getURL_BOX', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌 회원아이디
    var UserID = 'testkorea';

    // 플러스친구계정관리(PLUSFRINED) 발신번호관리(SENDER) 알림톡템플릿관리(TEMPLATE) 전송내역(BOX)
    var TOGO = 'BOX';

    kakaoService.getURL(testCorpNum, TOGO, UserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 카카오톡 전송단가를 확인합니다.
 */
router.get('/getUnitCost', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌 회원아이디
    var UserID = 'testkorea';

    // 전송유형 ( ATS-알림톡 / FTS-친구톡텍스트 / FMS-친구톡이미지 )
    var kakaoType = popbill.KakaoType.ATS;

    kakaoService.getUnitCost(testCorpNum, kakaoType, UserID,
        function (unitCost) {
            res.render('result', {path: req.path, result: unitCost});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 카카오톡 API 서비스 과금정보를 확인합니다.
 */
router.get('/getChargeInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌 회원아이디
    var UserID = 'testkorea';

    // 전송유형 ( ATS-알림톡 / FTS-친구톡텍스트 / FMS-친구톡이미지 )
    var kakaoType = popbill.KakaoType.ATS;

    kakaoService.getChargeInfo(testCorpNum, kakaoType, UserID,
        function (result) {
            res.render('Base/getChargeInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 연동회원의 잔여포인트를 확인합니다.
 * - 과금방식이 파트너과금인 경우 파트너 잔여포인트(GetPartnerBalance API)
 *   를 통해 확인하시기 바랍니다.
 */
router.get('/getBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    kakaoService.getBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 팝빌 관련 팝업 URL을 반환합니다.
 * - 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
 */
router.get('/getPopbillURL_CHRG', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌 회원아이디
    var UserID = 'testkorea';

    // LOGIN(팝빌 로그인), CHRG(연동회원 포인트충전)
    var TOGO = 'CHRG';

    kakaoService.getPopbillURL(testCorpNum, UserID, TOGO,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 파트너의 잔여포인트를 확인합니다.
 * - 과금방식이 연동과금인 경우 연동회원 잔여포인트(GetBalance API)를
 *   이용하시기 바랍니다.
 */
router.get('/getPartnerBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    kakaoService.getPartnerBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 파트너 포인트 충전 팝업 URL을 반환합니다.
 * - 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
 */
router.get('/getPartnerURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // CHRG(파트너 포인트충전)
    var TOGO = 'CHRG';

    kakaoService.getPartnerURL(testCorpNum, TOGO,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 해당 사업자의 파트너 연동회원 가입여부를 확인합니다.
 */
router.get('/checkIsMember', function (req, res, next) {

    //조회할 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    kakaoService.checkIsMember(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {code: Error.code, message: Error.message});
        })
});

/**
 * 팝빌 회원아이디 중복여부를 확인합니다.
 */
router.get('/checkID', function (req, res, next) {

    // 조회할 아이디
    var testID = 'testkorea';

    kakaoService.checkID(testID,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 팝빌 연동회원 가입을 요청합니다.
 */
router.get('/joinMember', function (req, res, next) {

    // 회원정보
    var joinInfo = {
        // 링크아이디
        LinkID: 'TESTER',

        // 사업자번호, '-' 제외 10자리
        CorpNum: '1234567890',

        // 회원 아이디
        ID: 'kakaoid',

        // 회원 비밀번호
        PWD: 'this_is_password',

        // 대표자명
        CEOName: '대표자성명',

        // 상호
        CorpName: '테스트상호',

        // 주소
        Addr: '주소',

        // 업태
        BizType: '업태',

        // 종목
        BizClass: '업종',

        // 담당자 성명
        ContactName: '담당자 성명',

        // 메일주소
        ContactEmail: 'test@test.com',

        // 연락처
        ContactTEL: '010-1234-1234',
    };

    kakaoService.joinMember(joinInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/**
 * 팝빌(www.popbill.com)에 로그인된 팝빌 URL을 반환합니다.
 * - 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
 */
router.get('/getAccessURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    kakaoService.getAccessURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/**
 * 팝빌 연동회원 포인트 충전 URL을 반환합니다.
 * - 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
 */
router.get('/getChargeURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    kakaoService.getChargeURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/**
 * 연동회원의 담당자를 신규로 등록합니다.
 */
router.get('/registContact', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 담당자 정보
    var contactInfo = {

        // 아이디
        id: 'kakao_regist',

        // 비밀번호
        pwd: 'test_password',

        // 담당자명
        personName: '담당자명',

        // 연락처
        tel: '070-1234-1234',

        // 휴대폰번호
        hp: '010-1234-1234',

        // 메일주소
        email: 'test@test.co.kr',

        // 팩스번호
        fax: '070-1234-1234',

        // 전체조회여부, 회사조회(true), 개인조회(false)
        searchAllAllowYN: true
    };

    kakaoService.registContact(testCorpNum, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 연동회원의 담당자 목록을 확인합니다.
 */
router.get('/listContact', function (req, res, next) {

    // 조회할 아이디
    var testCorpNum = '1234567890';

    kakaoService.listContact(testCorpNum,
        function (result) {
            res.render('Base/listContact', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 담당자의 정보를 수정합니다
 */
router.get('/updateContact', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    // 담당자 정보 항목
    var contactInfo = {

        // 담당자 아이디
        id: testUserID,

        // 담당자명
        personName: '수정_담당자명',

        // 연락처
        tel: '070-0987-0987',

        // 휴대폰번호
        hp: '010-0987-0987',

        // 메일주소
        email: 'dev@popbill.co.kr',

        // 팩스번호
        fax: '070-1234-4324',

        // 전체조회여부, 회사조회(true), 개인조회(false)
        searchAllAllowYN: true
    };

    kakaoService.updateContact(testCorpNum, testUserID, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 연동회원의 회사정보를 확인합니다.
 */
router.get('/getCorpInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    kakaoService.getCorpInfo(testCorpNum,
        function (result) {
            res.render('Base/getCorpInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 연동회원의 회사정보를 수정합니다
 */
router.get('/updateCorpInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 회사정보
    var corpInfo = {

        // 대표자명
        ceoname: '수정된 대표자성명',

        // 상호
        corpName: '수정된 업체명',

        // 주소
        addr: '수정된 주소',

        // 업태
        bizType: '수정된 업태',

        // 종목
        bizClass: '수정된 종목'
    };

    kakaoService.updateCorpInfo(testCorpNum, corpInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

module.exports = router;
