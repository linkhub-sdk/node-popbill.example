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
 * 문자 API 서비스 클래스 생성
 */
var messageService = popbill.MessageService();


// Message API List Index
router.get('/', function (req, res, next) {
    res.render('Message/index', {});
});


/**
 * 팝빌 회원아이디 중복여부를 확인합니다.
 */
router.get('/checkID', function (req, res, next) {

    // 조회할 아이디
    var testID = 'testkorea';

    messageService.checkID(testID,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/**
 * 문자 API 서비스 과금정보를 확인합니다.
 */
router.get('/getChargeInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문자전송유형, SMS(단문), LMS(장문), MMS(포토)
    var messageType = popbill.MessageType.SMS;

    messageService.getChargeInfo(testCorpNum, messageType,
        function (result) {
            res.render('Base/getChargeInfo', {path: req.path, result: result});
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

    messageService.listContact(testCorpNum,
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
        personName: '담당자명',

        // 연락처
        tel: '070-4304-2991',

        // 휴대폰번호
        hp: '010-1234-4324',

        // 메일주소
        email: 'dev@linkhub.co.kr',

        // 팩스번호
        fax: '070-1234-4324',

        // 전체조회여부, 회사조회(true), 개인조회(false)
        searchAllAllowYN: true
    };

    messageService.updateContact(testCorpNum, testUserID, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
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
        id: 'testkorea031213125',

        // 비밀번호
        pwd: 'testpassword',

        // 담당자명
        personName: '담당자명0309',

        // 연락처
        tel: '070-4304-2991',

        // 휴대폰번호
        hp: '010-1234-1234',

        // 메일주소
        email: 'dev@linkhub.co.kr',

        // 팩스번호
        fax: '070-4304-2991',

        // 전체조회여부, 회사조회(true), 개인조회(false)
        searchAllAllowYN: true
    };

    messageService.registContact(testCorpNum, contactInfo,
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

    messageService.getCorpInfo(testCorpNum,
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
        ceoname: "대표자성명",

        // 상호
        corpName: "업체명",

        // 주소
        addr: "서울시 강남구",

        // 업태
        bizType: "업태",

        // 종목
        bizClass: "종목"
    };

    messageService.updateCorpInfo(testCorpNum, corpInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/**
 * 해당 사업자의 파트너 연동회원 가입여부를 확인합니다.
 */
router.get('/checkIsMember', function (req, res, next) {

    // 조회할 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    messageService.checkIsMember(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {code: Error.code, message: Error.message});
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
        ContactTEL: '070-4304-2991',

        // 회원 아이디
        ID: 'userid',

        // 회원 비밀번호
        PWD: 'this_is_password'
    };

    messageService.joinMember(joinInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
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

    messageService.getBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint})
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

    messageService.getPartnerBalance(testCorpNum,
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

    // CHRG(포인트충전)
    var TOGO = 'CHRG';

    messageService.getPartnerURL(testCorpNum, TOGO,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/**
 * 팝빌 관련 팝업 URL을 반환합니다.
 * - 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
 */
router.get('/getPopbillURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // LOGIN(팝빌 로그인), CHRG(포인트충전)
    var TOGO = 'LOGIN';

    messageService.getPopbillURL(testCorpNum, TOGO,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


// SMS 단건전송
router.get('/sendSMS', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발신번호
    var sendNum = '07043042991';

    // 발신자명
    var sendName = '발신자명';

    // 수신번호
    var receiveNum = '000111222';

    // 수신자명
    var receiveName = '수신자명';

    // 메시지 내용, 90Byte 초과시 길이가 조정되어 전송
    var contents = 'SMS 단건전송 메시지 테스트';

    // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 광고문자 전송여부
    var adsYN = false;

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    messageService.sendSMS(testCorpNum, sendNum, receiveNum, receiveName, contents, reserveDT, adsYN, sendName, requestNum,
        function (receiptNum) {
            res.render('result', {path: req.path, result: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


// SMS 다량전송
router.get('/sendSMS_multi', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발신번호(동보전송용)
    var sendNum = '07043042991';

    // 메시지 내용(동보전송용), 90Byte 초과시 길이가 조정되어 전송
    var contents = '동보전송 메시지';

    // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 광고문자 전송여부
    var adsYN = false;

    // 개별전송정보 배열, 최대 1000건
    var Messages = [
        {
            Sender: '07043042991',       // 발신번호, 개별전송정보 배열에 발신자번호(Sender)가 없는 경우 동보전송 발신번호로 전송
            SenderName: '발신자명',        // 발신자명
            Receiver: '000111222',       // 수신번호
            ReceiverName: '수신자명1',      // 수신자명
            Contents: '문자 메시지 내용1',    // 메시지 내용, 90Byte 초과시 길이가 조정되어 전송
            // 개벌전송정보 배열에 메시지내용(Contents)이 없는경우 동보전송 메시지내용로 전송
        },
        {
            Sender: '07043042991',       // 발신번호, 개별전송정보 배열에 발신자번호(Sender)가 없는 경우 동보전송 발신번호로 전송
            SenderName: '발신자명',        // 발신자명
            Receiver: '000333444',       // 수신번호
            ReceiverName: '수신자명2',      // 수신자명
            Contents: '문자 메시지 내용2',    // 메시지 내용, 90Byte 초과시 길이가 조정되어 전송
            // 개벌전송정보 배열에 메시지내용(Contents)이 없는경우 동보전송 메시지내용로 전송
        }
    ]

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    messageService.sendSMS_multi(testCorpNum, sendNum, contents, Messages, reserveDT, adsYN, requestNum,
        function (receiptNum) {
            res.render('result', {path: req.path, result: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


// LMS 단건전송
router.get('/sendLMS', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발신번호
    var sendNum = '07043042991';

    // 발신자명
    var sendName = '발신자명';

    // 수신번호
    var receiveNum = '000111222';

    // 수신자명
    var receiveName = '수신자명';

    // 메시지 제목
    var subject = '장문 메시지 제목';

    // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송
    var contents = 'LMS 단건전송 테스트';

    // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 광고문자 전송여부
    var adsYN = false;

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    messageService.sendLMS(testCorpNum, sendNum, receiveNum, receiveName, subject, contents, reserveDT, adsYN, sendName, requestNum,
        function (receiptNum) {
            res.render('result', {path: req.path, result: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


// LMS 대량전송
router.get('/sendLMS_multi', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발신번호
    var sendNum = '07043042991';

    // 메시지 제목
    var subject = '장문 메시지 제목';

    // 메시지 내용(동보전송용), 2000byte 초과시 길이가 조정되어 전송
    var contents = 'LMS 대량전송 테스트';

    // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 광고문자 전송여부
    var adsYN = false;

    // 개별전송정보 배열, 최대 1000건
    var Messages = [{
        Sender: '07043042991',       // 발신번호, 개별전송정보 배열에 발신자번호(Sender) 항목이 없는 경우 동보전송 발신번호로 전송
        SenderName: '발신자명1',        // 발신자명
        Receiver: '000111222',       // 수신번호
        ReceiverName: '수신자명1',      // 수신자명
        Subject: '메시지 제목1',        // 메시지 제목
        Contents: '문자 메시지 내용1',    // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송,
        // 개벌전송정보 배열에 메시지내용(Contents)항목 없는경우 동보전송 메시지내용로 전송
    },
        {
            Sender: '07043042991',       // 발신번호
            SenderName: '발신자명2',        // 발신자명
            Receiver: '000222333',       // 수신번호
            ReceiverName: '수신자명2',      // 수신자명
            Subject: '메시지 제목2',        // 메시지 제목, 2000Byte 초과시 길이가 조정되어 전송
            Contents: '문자 메시지 내용 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만세 무궁화 삼천리 화려강산 ', // 메시지 내용
        }
    ]

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    messageService.sendLMS_multi(testCorpNum, sendNum, subject, contents, Messages, reserveDT, adsYN, requestNum,
        function (receiptNum) {
            res.render('result', {path: req.path, result: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


// XMS 단건전송
router.get('/sendXMS', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발신번호
    var sendNum = '07043042991';

    // 발신자명
    var sendName = '발신자명';

    // 수신번호
    var receiveNum = '000333444';

    // 수신자명
    var receiveName = '수신자명';

    // 메시지 제목
    var subject = '자동인식 문자전송 제목';

    // 메시지 내용, 길이에 따라 90Byte 기준으로 단/장문 자동인식되어 전송 됨.
    var contents = 'XMS 자동인식 단건전송';

    // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 광고문자 전송여부
    var adsYN = false;

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    messageService.sendXMS(testCorpNum, sendNum, receiveNum, receiveName, subject, contents, reserveDT, adsYN, sendName, requestNum,
        function (receiptNum) {
            res.render('result', {path: req.path, result: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


// XMS 대량전송
router.get('/sendXMS_multi', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발신번호(동보전송용)
    var sendNum = '07043042991';

    // 메시지 제목(동보전송용)
    var subject = '자동인식 문자전송 제목';

    // 메시지 내용, 길이에 따라 90Byte 기준으로 단/장문 자동인식되어 전송 됨.
    var contents = 'XMS 자동인식 단건전송 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만세 무궁화 삼천리 화려강산 대한사람 대한으로';

    // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 광고문자 전송여부
    var adsYN = false;

    // 개별전송정보 배열, 최대 1000건
    var Messages = [
        {
            Sender: '07043042991',       // 발신번호
            SenderName: '발신자명',        // 발신자명
            Receiver: '000111222',       // 수신번호
            ReceiverName: '수신자명',      // 수신자명
            Subject: '메시지 제목1',        // 메시지 제목
            Contents: '문자 메시지 내용1',    // 메시지 내용, 90Byte 기준으로 SMS/LMS 자동인식되어 전송
        },
        {
            Sender: '07043042991',       // 발신번호
            SenderName: '발신자명',        // 발신자명
            Receiver: '000222333',       // 수신번호
            ReceiverName: '수신자명',      // 수신자명
            Subject: '메시지 제목2',        // 메시지 제목
            // 메시지 내용, 90Byte 기준으로 SMS/LMS 자동인식되어 전송
            Contents: '단/장문 자동인식 문자전송 내용 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만세 무궁화 삼천리 화려강산 ',
        }
    ]

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    messageService.sendXMS_multi(testCorpNum, sendNum, subject, contents, Messages, reserveDT, adsYN, requestNum,
        function (receiptNum) {
            res.render('result', {path: req.path, result: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


// 포토 문자 단건전송
router.get('/sendMMS', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발신번호
    var sendNum = '07043042991';

    // 수신번호
    var receiveNum = '000111222';

    // 수신자명
    var receiveName = '수신자명';

    // 메시지 제목
    var subject = 'MMS 메시지 제목';

    // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송
    var contents = 'MMS 단건전송 테스트';

    // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 광고문자 전송여부
    var adsYN = false;

    // MMS 이지 파일경로, 최대 300Kbyte, JPEG 포맷
    var filePaths = ['./fmsImage.jpg'];

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    messageService.sendMMS(testCorpNum, sendNum, receiveNum, receiveName, subject, contents, filePaths, reserveDT, adsYN, requestNum,
        function (receiptNum) {
            res.render('result', {path: req.path, result: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


// 포토 문자 다량전송
router.get('/sendMMS_multi', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발신번호(동보전송용)
    var senderNum = '07043042991';

    // 메시지 제목(동보전송용)
    var subject = '장문 메시지 제목';

    // 메시지 내용(동보전송용), 2000Byte 초과시 길이가 조정되어 전송
    var contents = 'MMS 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만세 무궁화 삼천리 화려강산 대한사람 대한으로';

    // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 광고문자 전송여부
    var adsYN = false;

    // MMS 이지 파일경로, 최대 300Kbyte, JPEG 포맷
    var filePaths = ['./fmsImage.jpg'];

    // 개별전송정보, 최대 1000건
    var Messages = [
        {
            Sender: '07043042991',         // 발신번호
            SenderName: '발신자명',          // 발신자명
            Receiver: '000111222',         // 수신번호
            ReceiverName: '수신자명',
            Subject: 'MMS 테스트 제목1',
            Contents: 'MMS 전송 테스트 내용1',  // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송
        },
        {
            Sender: '07043042991',         // 발신번호
            SenderName: '발신자명',          // 발신자명
            Receiver: '000111222',         // 수신번호
            ReceiverName: '수신자명',
            Subject: 'MMS 테스트 제목2',
            Contents: 'MMS 전송 테스트 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만 무궁화 삼천리 화려강산 ', // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송
        }
    ]

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    messageService.sendMMS_multi(testCorpNum, senderNum, subject, contents, Messages, filePaths, reserveDT, adsYN, requestNum,
        function (receiptNum) {
            res.render('result', {path: req.path, result: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/**
 * 검색조건을 사용하여 문자전송 목록을 조회합니다.
 */
router.get('/search', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 검색시작일자, 날짜형식(yyyyMMdd)
    var SDate = '20180901';

    // 검색종료일자, 날짜형식(yyyyMMdd)
    var EDate = '20180931';

    // 전송상태값 배열, 1-대기, 2-성공, 3-실패, 4-취소
    var State = [1, 2, 3, 4];

    // 문자전송유형 배열, SMS-단문, LMS-장문, MMS-포토
    var Item = ['SMS', 'LMS', 'MMS'];

    // 예약여부, true-예약전송 조회, false-전체조회
    var ReserveYN = false;

    // 개인조회여부, true-개인조회, false-회사조회
    var SenderYN = false;

    // 정렬방향, D-내림차순, A-오름차순
    var Order = 'D';

    // 페이지번호
    var Page = 1;

    // 페이지 목록개수, 최대 1000건
    var PerPage = 30;

    messageService.search(testCorpNum, SDate, EDate, State, Item, ReserveYN, SenderYN, Order, Page, PerPage,
        function (result) {
            res.render('Message/Search', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/**
 * 문자전송요청에 대한 전송결과를 확인합니다.
 */
router.get('/getMessages', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문자전송 접수번호
    var receiptNum = '016111710000000008';

    messageService.getMessages(testCorpNum, receiptNum,
        function (result) {
            res.render('Message/SentMessage', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/**
 * 문자전송요청시 할당한 전송요청번호(requestNum)로 전송상태를 확인합니다
 */
router.get('/getMessagesRN', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문자전송 요청번호
    var requestNum = '20180903141403';

    messageService.getMessagesRN(testCorpNum, requestNum,
        function (result) {
            res.render('Message/SentMessage', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});



// /**
//  * 문자 전송내역 요약정보를 확인합니다.
//  */
router.get('/getStates', function(req,res,next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    // 문자전송 접수번호 배열 ,최대 1000건
    var reciptNumList = ['018041717000000018', '018041717000000019'];

    messageService.getStates(testCorpNum, reciptNumList, testUserID,
        function(result) {
            res.render('Message/GetStates',{path : req.path, result : result});
        }, function(Error) {
            res.render('response', {path : req.path, code : Error.code, message : Error.message});
        });
});

/**
 * 예약문자전송을 취소합니다.
 * - 예약취소는 예약전송시간 10분전까지만 가능합니다.
 */
router.get('/cancelReserve', function (req, res, next) {

    // 팝빌회원 사업자번호
    var testCorpNum = '1234567890';

    // 문자전송 접수번호
    var receiptNum = '015081117000000018';

    messageService.cancelReserve(testCorpNum, receiptNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/**
 * 문자전송요청시 할당한 전송요청번호(requestNum)로
 * 예약문자 전송을 취소합니다.
 * - 예예약취소는 예약전송시간 10분전까지만 가능합니다.
 */
router.get('/cancelReserveRN', function (req, res, next) {

    // 팝빌회원 사업자번호
    var testCorpNum = '1234567890';

    // 문자전송 요청번호
    var requestNum = '20180928104830';

    messageService.cancelReserveRN(testCorpNum, requestNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 문자메시지 전송내역 팝업 URL을 반환합니다.
 * - 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
 */
router.get('/getURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // BOX(전송내역조회)
    var TOGO = 'BOX';

    messageService.getURL(testCorpNum, TOGO,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/**
 * 문자메시지 전송단가를 확인합니다.
 */
router.get('/getUnitCost', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문자전송유형, SMS(단문), LMS(장문), MMS(포토)
    var messageType = popbill.MessageType.LMS;

    messageService.getUnitCost(testCorpNum, messageType,
        function (unitCost) {
            res.render('result', {path: req.path, result: unitCost});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/**
 * 080 서비스 수신거부 목록을 확인합니다.
 */
router.get('/getAutoDenyList', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    messageService.getAutoDenyList(testCorpNum,
        function (response) {
            res.render('Message/AutoDenyList', {path: req.path, result: response});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/**
 * 문자 발신번호 목록을 확인합니다.
 */
router.get('/getSenderNumberList', function (req, res, next) {

    // 조회할 아이디
    var testCorpNum = '1234567890';

    messageService.getSenderNumberList(testCorpNum,
        function (result) {
            res.render('Message/SenderNumberList', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


module.exports = router;
