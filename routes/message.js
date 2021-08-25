var express = require('express');
var router = express.Router();
var popbill = require('popbill');

/*
 * 팝빌 서비스 연동환경 초기화
 */
popbill.config({

    // 링크아이디
    LinkID: 'TESTER',

    // 비밀키
    SecretKey: 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=',

    // 연동환경 설정값, 개발용(true), 상업용(false)
    IsTest: true,

    // 인증토큰 IP제한기능 사용여부, 권장(true)
    IPRestrictOnOff: true,

    // 인증토큰정보 로컬서버 시간 사용여부
    UseLocalTimeYN: true,

    // 팝빌 API 서비스 고정 IP 사용여부(GA)
    UseStaticIP: false,

    // 로컬서버 시간 사용여부 true-사용(기본값-권장), false-미사용
    UseLocalTimeYN: true,

    defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

/*
 * 문자 API 서비스 클래스 생성
 */
var messageService = popbill.MessageService();

// Message API List Index
router.get('/', function (req, res, next) {
    res.render('Message/index', {});
});

/*
 * 발신번호를 등록하고 내역을 확인하는 문자 발신번호 관리 페이지 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/message/node/api#GetSenderNumberMgtURL
 */
router.get('/getSenderNumberMgtURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    messageService.getSenderNumberMgtURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌에 등록한 연동회원의 문자 발신번호 목록을 확인합니다.
 * - https://docs.popbill.com/message/node/api#GetSenderNumberList
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

/*
 * 최대 90byte의 단문(SMS) 메시지 1건 전송을 팝빌에 접수합니다.
 * - https://docs.popbill.com/message/node/api#SendSMS
 */
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

/*
 * 최대 90byte의 단문(SMS) 메시지 다수건 전송을 팝빌에 접수합니다. (최대 1,000건)
 * - 모든 수신자에게 동일한 내용을 전송하거나(동보전송), 수신자마다 개별 내용을 전송할 수 있습니다(대량전송).
 * - https://docs.popbill.com/message/node/api#SendSMS_multi
 */
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

/*
 * 최대 2,000byte의 장문(LMS) 메시지 1건 전송을 팝빌에 접수합니다.
 * - https://docs.popbill.com/message/node/api#SendLMS
 */
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

/*
 * 최대 2,000byte의 장문(LMS) 메시지 다수건 전송을 팝빌에 접수합니다. (최대 1,000건)
 * - 모든 수신자에게 동일한 내용을 전송하거나(동보전송), 수신자마다 개별 내용을 전송할 수 있습니다(대량전송).
 * - https://docs.popbill.com/message/node/api#SendLMS_multi
 */
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

/*
 * 최대 2,000byte의 메시지와 이미지로 구성된 포토문자(MMS) 1건 전송을 팝빌에 접수합니다.
 * - 이미지 파일 포맷/규격 : 최대 300Kbyte(JPEG, JPG), 가로/세로 1,000px 이하 권장
 * - https://docs.popbill.com/message/node/api#SendMMS
 */
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

/*
 * 최대 2,000byte의 메시지와 이미지로 구성된 포토문자(MMS) 다수건 전송을 팝빌에 접수합니다. (최대 1,000건)
 * - 모든 수신자에게 동일한 내용을 전송하거나(동보전송), 수신자마다 개별 내용을 전송할 수 있습니다(대량전송).
 * - 이미지 파일 포맷/규격 : 최대 300Kbyte(JPEG), 가로/세로 1,000px 이하 권장
 * - https://docs.popbill.com/message/node/api#SendMMS_multi
 */
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

/*
 * 메시지 크기(90byte)에 따라 단문/장문(SMS/LMS)을 자동으로 인식하여 1건의 메시지를 전송을 팝빌에 접수합니다.
 * - 단문(SMS) = 90byte 이하의 메시지, 장문(LMS) = 2000byte 이하의 메시지.
 * - https://docs.popbill.com/message/node/api#SendXMS
 */
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

/*
 * 메시지 크기(90byte)에 따라 단문/장문(SMS/LMS)을 자동으로 인식하여 다수건의 메시지 전송을 팝빌에 접수합니다. (최대 1,000건)
 * - 모든 수신자에게 동일한 내용을 전송하거나(동보전송), 수신자마다 개별 내용을 전송할 수 있습니다(대량전송).
 * - 단문(SMS) = 90byte 이하의 메시지, 장문(LMS) = 2000byte 이하의 메시지.
 * - https://docs.popbill.com/message/node/api#SendXMS_multi
 */
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

/*
 * 팝빌에서 반환받은 접수번호를 통해 예약접수된 문자 메시지 전송을 취소합니다. (예약시간 10분 전까지 가능)
 * - https://docs.popbill.com/message/node/api#CancelReserve
 */
router.get('/cancelReserve', function (req, res, next) {

    // 팝빌회원 사업자번호
    var testCorpNum = '1234567890';

    // 문자전송 접수번호
    var receiptNum = '021010911000000010';

    messageService.cancelReserve(testCorpNum, receiptNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너가 할당한 전송요청 번호를 통해 예약접수된 문자 전송을 취소합니다. (예약시간 10분 전까지 가능)
 * - https://docs.popbill.com/message/node/api#CancelReserveRN
 */
router.get('/cancelReserveRN', function (req, res, next) {

    // 팝빌회원 사업자번호
    var testCorpNum = '1234567890';

    // 문자전송 요청번호
    var requestNum = '20210801-001';

    messageService.cancelReserveRN(testCorpNum, requestNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌에서 반환받은 접수번호를 통해 문자 전송상태 및 결과를 확인합니다.
 * - https://docs.popbill.com/message/node/api#GetMessages
 */
router.get('/getMessages', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문자전송 접수번호
    var receiptNum = '021010911000000009';

    messageService.getMessages(testCorpNum, receiptNum,
        function (result) {
            res.render('Message/SentMessage', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너가 할당한 전송요청 번호를 통해 문자 전송상태 및 결과를 확인합니다.
 * - https://docs.popbill.com/message/node/api#GetMessagesRN
 */
router.get('/getMessagesRN', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문자전송 요청번호
    var requestNum = '20210801-001';

    messageService.getMessagesRN(testCorpNum, requestNum,
        function (result) {
            res.render('Message/SentMessage', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 문자전송에 대한 전송결과 요약정보를 확인합니다.
 * - https://docs.popbill.com/message/node/api#GetStates
 */
router.get('/getStates', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    // 문자전송 접수번호 배열 ,최대 1000건
    var reciptNumList = ['021041717000000018', '021041717000000019'];

    messageService.getStates(testCorpNum, reciptNumList, testUserID,
        function (result) {
            res.render('Message/GetStates', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 검색조건에 해당하는 문자 전송내역을 조회합니다. (최대 검색기간 : 6개월)
 * - https://docs.popbill.com/message/node/api#Search
 */
router.get('/search', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 검색시작일자, 날짜형식(yyyyMMdd)
    var SDate = '20210801';

    // 검색종료일자, 날짜형식(yyyyMMdd)
    var EDate = '20210810';

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

    // 조회 검색어.
    // 문자 전송시 입력한 발신자명 또는 수신자명 기재.
    // 조회 검색어를 포함한 발신자명 또는 수신자명을 검색합니다.
    var Qstring = "";

    messageService.search(testCorpNum, SDate, EDate, State, Item, ReserveYN, SenderYN, Order, Page, PerPage, Qstring,
        function (result) {
            res.render('Message/Search', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 사이트와 동일한 문자 전송내역 확인 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/message/node/api#GetSentListURL
 */
router.get('/getSentListURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    messageService.getSentListURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 전용 080 번호에 등록된 수신거부 목록을 반환합니다.
 * - https://docs.popbill.com/message/node/api#GetAutoDenyList
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

/*
 * 연동회원의 잔여포인트를 확인합니다.
 * - 과금방식이 파트너과금인 경우 파트너 잔여포인트(GetPartnerBalance API) 를 통해 확인하시기 바랍니다.
 * - https://docs.popbill.com/message/node/api#GetBalance
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

/*
 * 연동회원 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/message/node/api#GetChargeURL
 */
router.get('/getChargeURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    messageService.getChargeURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 결제내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/message/node/api#GetPaymentURL
 */
router.get('/getPaymentURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    messageService.getPaymentURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 사용내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/message/node/api#GetUseHistoryURL
 */
router.get('/getUseHistoryURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    messageService.getUseHistoryURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너의 잔여포인트를 확인합니다.
 * - 과금방식이 연동과금인 경우 연동회원 잔여포인트(GetBalance API)를 이용하시기 바랍니다.
 * - https://docs.popbill.com/message/node/api#GetPartnerBalance
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

/*
 * 파트너 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/message/node/api#GetPartnerURL
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

/*
 * 문자 전송시 과금되는 포인트 단가를 확인합니다.
 * - https://docs.popbill.com/message/node/api#GetUnitCost
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

/*
 * 팝빌 문자 API 서비스 과금정보를 확인합니다.
 * - https://docs.popbill.com/message/node/api#GetChargeInfo
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

/*
 * 사업자번호를 조회하여 연동회원 가입여부를 확인합니다.
 * - https://docs.popbill.com/message/node/api#CheckIsMember
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

/*
 * 사용하고자 하는 아이디의 중복여부를 확인합니다.
 * - https://docs.popbill.com/message/node/api#CheckID
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

/*
 * 사용자를 연동회원으로 가입처리합니다.
 * - https://docs.popbill.com/message/node/api#JoinMember
 */
router.get('/joinMember', function (req, res, next) {

    // 회원정보
    var joinInfo = {

        // 회원 아이디 (6자 이상 50자 미만)
        ID: 'userid',

        // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
        Password: 'asdf8536!@#',

        // 링크아이디
        LinkID: messageService._config.LinkID,

        // 사업자번호, '-' 제외 10자리
        CorpNum: '1234567890',

        // 대표자명 (최대 100자)
        CEOName: '대표자성명',

        // 상호 (최대 200자)
        CorpName: '테스트상호',

        // 주소 (최대 300자)
        Addr: '주소',

        // 업태 (최대 100자)
        BizType: '업태',

        // 종목 (최대 100자)
        BizClass: '업종',

        // 담당자 성명 (최대 100자)
        ContactName: '담당자 성명',

        // 담당자 이메일 (최대 20자)
        ContactEmail: 'test@test.com',

        // 담당자 연락처 (최대 20자)
        ContactTEL: '070-4304-2991',

        // 담당자 휴대폰번호 (최대 20자)
        ContactHP: '010-1234-1234'

    };

    messageService.joinMember(joinInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 사이트에 로그인 상태로 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/message/node/api#GetAccessURL
 */
router.get('/getAccessURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    messageService.getAccessURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 담당자(팝빌 로그인 계정)를 추가합니다.
 * - https://docs.popbill.com/message/node/api#RegistContact
 */
router.get('/registContact', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 담당자 정보
    var contactInfo = {

        // 아이디 (6자 이상 50자 미만)
        id: 'testkorea03033',

        // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
        Password: 'asdf8536!@#',

        // 담당자명 (최대 100자)
        personName: '담당자명0309',

        // 연락처 (최대 20자)
        tel: '070-4304-2991',

        // 휴대폰번호 (최대 20자)
        hp: '010-1234-1234',

        // 팩스번호 (최대 20자)
        fax: '070-4304-2991',

        // 이메일 (최대 100자)
        email: 'test@test.co.kr',

        // 담당자 권한, 1 : 개인권한, 2 : 읽기권한, 3 : 회사권한
        searchRole: 3

    };

    messageService.registContact(testCorpNum, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보을 확인합니다.
 * - https://docs.popbill.com/message/node/api#GetContactInfo
 */
router.get('/getContactInfo', function (req, res, next) {

    // 팝빌회원 사업자번호
    var testCorpNum = '1234567890';

    // 확인할 담당자 아이디
    var contactID = 'checkContactID';

    messageService.getContactInfo(testCorpNum, contactID,
        function (result) {
            res.render('Base/getContactInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 목록을 확인합니다.
 * - https://docs.popbill.com/message/node/api#ListContact
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

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보를 수정합니다.
 * - https://docs.popbill.com/message/node/api#UpdateContact
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

        // 담당자명 (최대 100자)
        personName: '담당자명0309',

        // 연락처 (최대 20자)
        tel: '070-4304-2991',

        // 휴대폰번호 (최대 20자)
        hp: '010-1234-1234',

        // 팩스번호 (최대 20자)
        fax: '070-4304-2991',

        // 이메일 (최대 100자)
        email: 'test@test.co.kr',

        // 담당자 권한, 1 : 개인권한, 2 : 읽기권한, 3 : 회사권한
        searchRole: 3

    };

    messageService.updateContact(testCorpNum, testUserID, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 확인합니다.
 * - https://docs.popbill.com/message/node/api#GetCorpInfo
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

/*
 * 연동회원의 회사정보를 수정합니다
 * - https://docs.popbill.com/message/node/api#UpdateCorpInfo
 */
router.get('/updateCorpInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 회사정보
    var corpInfo = {

        // 대표자명 (최대 100자)
        ceoname: "대표자성명_nodejs",

        // 상호 (최대 200자)
        corpName: "업체명_nodejs",

        // 주소 (최대 300자)
        addr: "서구 천변좌로_nodejs",

        // 업태 (최대 100자)
        bizType: "업태_nodejs",

        // 종목 (최대 100자)
        bizClass: "종목_nodejs"

    };

    messageService.updateCorpInfo(testCorpNum, corpInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

module.exports = router;
