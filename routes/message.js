var express = require('express');
var router = express.Router();
var popbill = require('popbill');

popbill.config({
  LinkID :'TESTER', // 링크아이디
  SecretKey : 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=', // 비밀키
  IsTest : true,   // 연동환경 설정값, true(테스트용), false(상업용)
  defaultErrorHandler :  function(Error) {
    console.log('Error Occur : [' + Error.code + '] ' + Error.message);
  }
});

// 문자 API 모듈초기화
var messageService = popbill.MessageService();

// Message API List Index
router.get('/', function(req, res, next) {
  res.render('Message/index', {});
});

// 아이디 중복 확인
router.get('/checkID', function (req, res, next){
  var testID = 'testkorea';  // 조회할 아이디

  messageService.checkID(testID,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 담당자 목록 조회
router.get('/listContact', function (req, res, next){
  var testCorpNum = '1234567890';  // 조회할 아이디

  messageService.listContact(testCorpNum,
    function(result){
      res.render('Base/listContact', { path: req.path, result : result});
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 담당자 정보 수정
router.get('/updateContact', function (req, res, next){
  var testCorpNum = '1234567890';  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';

  var contactInfo =  {
    personName : '담당자명0315',
    tel : '070-7510-4324',
    hp : '010-1234-4324',
    email : 'code@linkhub.co.kr',
    fax : '070-1234-4324',
    searchAllAllowYN : true,
    mgrYN : true
  };

  messageService.updateContact(testCorpNum, testUserID, contactInfo,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});


// 담당자 추가
router.get('/registContact', function (req, res, next){
  var testCorpNum = '1234567890';  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';

  var contactInfo =  {
    id : 'testkorea0315',
    pwd : 'testpassword',
    personName : '담당자명0309',
    tel : '070-7510-3710',
    hp : '010-1234-1234',
    email : 'code@linkhub.co.kr',
    fax : '070-1234-1234',
    searchAllAllowYN : true,
    mgrYN : false
  };

  messageService.registContact(testCorpNum, testUserID, contactInfo,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 회사정보 조회
router.get('/getCorpInfo', function (req, res, next){
  var testCorpNum = '1234567890';  // 팝빌회원 사업자번호, '-' 제외 10자리

  messageService.getCorpInfo(testCorpNum,
    function(result){
      res.render('Base/getCorpInfo', { path: req.path, result : result});
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 회사정보 수정
router.get('/updateCorpInfo', function (req, res, next){
  var testCorpNum = '1234567890';  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';    // 팝빌회원 아이디

  var corpInfo = {
    ceoname : "대표자성명0315",
    corpName : "업체명_0315",
    addr : "서구 천변좌로_0315",
    bizType : "업태_0315",
    bizClass : "종목_0315"
  };

  messageService.updateCorpInfo(testCorpNum, testUserID, corpInfo,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 연동회원 가입여부 확인
router.get('/checkIsMember', function(req, res, next) {

  var testCorpNum = '1234567890';   // 조회할 사업자번호, '-' 제외 10자리

  messageService.checkIsMember(testCorpNum,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {code : Error.code, message : Error.message});
  });
});

// 회원가입 요청
router.get('/joinMember', function(req,res,next) {

  var joinInfo =  {
    LinkID : 'TESTER',       // 링크아이디
    CorpNum : '1231212312',  // 사업자번호, '-' 제외 10자리
    CEOName : '대표자성명',
    CorpName : '테스트상호',
    Addr : '주소',
    ZipCode : '우편번호',
    BizType : '업태',
    BizClass : '업종',
    ContactName : '담당자 성명',
    ContactEmail : 'test@test.com',
    ContactTEL : '070-7510-6766',
    ID : 'userid',
    PWD : 'this_is_password'
  };

  messageService.joinMember(joinInfo,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 연동회원 잔여포인트 조회
router.get('/getBalance', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리

  messageService.getBalance(testCorpNum,
    function(remainPoint){
      res.render('result', {path : req.path, result : remainPoint})
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});

// 파트너 잔여포인트 조회
router.get('/getPartnerBalance', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리

  messageService.getPartnerBalance(testCorpNum,
    function(remainPoint){
      res.render('result', {path : req.path, result : remainPoint});
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
  });
});

// 팝빌 SSO URL 요청
router.get('/getPopbillURL', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';     // 팝빌회원 아이디
  var TOGO = 'CHRG';                // LOGIN(팝빌 로그인), CHRG(포인트충전)

  messageService.getPopbillURL(testCorpNum, testUserID, TOGO,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

// SMS 단건전송
router.get('/sendSMS', function(req,res,next){

  var testCorpNum = '1234567890';           // 팝빌회원 사업자번호, '-' 제외 10자리
  var sendNum = '07075103710';              // 발신번호
  var receiveNum = '000111222';             // 수신번호
  var receiveName = '수신자명';               // 수신자명
  var contents = 'SMS 단건전송 메시지 테스트';   // 메시지 내용, 90Byte 초과시 길이가 조정되어 전송
  var reserveDT = '';                      // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
  var adsYN = false;                        // 광고문자 전송여부

  messageService.sendSMS(testCorpNum, sendNum, receiveNum, receiveName, contents, reserveDT, adsYN,
    function(receiptNum){
      res.render('result', {path : req.path, result : receiptNum});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

// SMS 다량전송
router.get('/sendSMS_multi', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리
  var sendNum = '07075103710';        // 발신번호(동보전송용)
  var contents = '동보전송 메시지';       // 메시지 내용(동보전송용), 90Byte 초과시 길이가 조정되어 전송
  var reserveDT = '';                 // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
  var adsYN = false;                   // 광고문자 전송여부

  // 개별전송정보 배열, 최대 1000건
  var Messages = [
    {
      Sender : '07075103710',       // 발신번호, 개별전송정보 배열에 발신자번호(Sender)가 없는 경우 동보전송 발신번호로 전송
      Receiver : '000111222',       // 수신번호
      ReceiverName : '수신자명1',      // 수신자명
      Contents :'문자 메시지 내용1',    // 메시지 내용, 90Byte 초과시 길이가 조정되어 전송
                                    // 개벌전송정보 배열에 메시지내용(Contents)이 없는경우 동보전송 메시지내용로 전송
    },
    {
      Sender : '07075103710',       // 발신번호, 개별전송정보 배열에 발신자번호(Sender)가 없는 경우 동보전송 발신번호로 전송
      Receiver : '000111222',       // 수신번호
      ReceiverName : '수신자명2',      // 수신자명
      Contents :'문자 메시지 내용2',    // 메시지 내용, 90Byte 초과시 길이가 조정되어 전송
                                    // 개벌전송정보 배열에 메시지내용(Contents)이 없는경우 동보전송 메시지내용로 전송
    }
  ]

  messageService.sendSMS_multi(testCorpNum, sendNum, contents, Messages, reserveDT, adsYN,
    function(receiptNum){
      res.render('result', {path : req.path, result : receiptNum});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

// LMS 단건전송
router.get('/sendLMS', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리
  var sendNum = '07075103710';        // 발신번호
  var receiveNum = '000111222';       // 수신번호
  var receiveName = '수신자명';         // 수신자명
  var subject = '장문 메시지 제목';       // 메시지 제목
  var contents = 'LMS 단건전송 테스트';   // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송
  var reserveDT = '';                 // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
  var adsYN = false;                  // 광고문자 전송여부

  messageService.sendLMS(testCorpNum, sendNum, receiveNum, receiveName, subject, contents, reserveDT, adsYN,
    function(receiptNum){
      res.render('result', {path : req.path, result : receiptNum});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

// LMS 대량전송
router.get('/sendLMS_multi', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리
  var sendNum = '07075103710';        // 발신번호(동보전송용)
  var subject = '장문 메시지 제목';       // 메시지 제목(동보전송용)
  var contents = 'LMS 대량전송 테스트';   // 메시지 내용(동보전송용), 2000byte 초과시 길이가 조정되어 전송
  var reserveDT = '';                 // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
  var adsYN = false;                  // 광고문자 전송여부

  // 개별전송정보 배열, 최대 1000건
  var Messages = [{
      Sender : '07075103710',       // 발신번호, 개별전송정보 배열에 발신자번호(Sender) 항목이 없는 경우 동보전송 발신번호로 전송
      Receiver : '000111222',       // 수신번호
      ReceiverName : '수신자명1',      // 수신자명
      Subject : '메시지 제목1',        // 메시지 제목
      Contents :'문자 메시지 내용1',    // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송,
                                    // 개벌전송정보 배열에 메시지내용(Contents)항목 없는경우 동보전송 메시지내용로 전송
    },
    {
      Sender : '07075103710',       // 발신번호
      Receiver : '000222333',       // 수신번호
      ReceiverName : '수신자명2',      // 수신자명
      Subject : '메시지 제목2',        // 메시지 제목, 2000Byte 초과시 길이가 조정되어 전송
      Contents :'문자 메시지 내용 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만세 무궁화 삼천리 화려강산 ', // 메시지 내용
    }
  ]

  messageService.sendLMS_multi(testCorpNum, sendNum, subject, contents, Messages, reserveDT, adsYN,
    function(receiptNum){
      res.render('result', {path : req.path, result : receiptNum});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

// XMS 단건전송
router.get('/sendXMS', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리
  var sendNum = '07075103710';        // 발신번호
  var receiveNum = '000333444';       // 수신번호
  var receiveName = '수신자명';         // 수신자명
  var subject = '자동인식 문자전송 제목';   // 메시지 제목
  var contents = 'XMS 자동인식 단건전송';  // 90Byte 기준으로 SMS/LMS 자동인식되어 전송
  var reserveDT = '';                 // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
  var adsYN = false;                  // 광고문자 전송여부

  messageService.sendXMS(testCorpNum, sendNum, receiveNum, receiveName, subject, contents, reserveDT, adsYN,
    function(receiptNum){
      res.render('result', {path : req.path, result : receiptNum});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

// XMS 대량전송
router.get('/sendXMS_multi', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리
  var sendNum = '07075103710';        // 발신번호(동보전송용)
  var subject = '자동인식 문자전송 제목';   // 메시지 제목(동보전송용)
  var contents = 'XMS 자동인식 단건전송 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만세 무궁화 삼천리 화려강산 대한사람 대한으로';
  var reserveDT = '';                 // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
  var adsYN = false;                   // 광고문자 전송여부

  // 개별전송정보 배열, 최대 1000건
  var Messages = [
    {
      Sender : '07075103710',       // 발신번호
      Receiver : '000111222',       // 수신번호
      ReceiverName : '수신자명',      // 수신자명
      Subject : '메시지 제목1',        // 메시지 제목
      Contents :'문자 메시지 내용1',    // 메시지 내용, 90Byte 기준으로 SMS/LMS 자동인식되어 전송
    },
    {
      Sender : '07075103710',       // 발신번호
      Receiver : '000222333',       // 수신번호
      ReceiverName : '수신자명',      // 수신자명
      Subject : '메시지 제목2',        // 메시지 제목
      Contents :'단/장문 자동인식 문자전송 내용 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만세 무궁화 삼천리 화려강산 ', // 메시지 내용, 90Byte 기준으로 SMS/LMS 자동인식되어 전송
    }
  ]

  messageService.sendXMS_multi(testCorpNum, sendNum, subject, contents, Messages, reserveDT, adsYN,
    function(receiptNum){
      res.render('result', {path : req.path, result : receiptNum});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

// 포토 문자 단건전송
router.get('/sendMMS', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리
  var sendNum = '07075103710';        // 발신번호
  var receiveNum = '000111222';       // 수신번호
  var receiveName = '수신자명';         // 수신자명
  var subject = 'MMS 메시지 제목';       // 메시지 제목
  var contents = 'MMS 단건전송 테스트';   // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송
  var reserveDT = '';                 // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
  var adsYN = false;                  // 광고문자 전송여부

  var filePaths = ['../테스트.jpg']     // MMS 파일경로

  messageService.sendMMS(testCorpNum, sendNum, receiveNum, receiveName, subject, contents, filePaths, reserveDT, adsYN,
    function(receiptNum){
      res.render('result', {path : req.path, result : receiptNum});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

// 포토 문자 다량전송
router.get('/sendMMS_multi', function(req,res,next){

  var testCorpNum = '1234567890';      // 팝빌회원 사업자번호, '-' 제외 10자리
  var senderNum = '07075103710';       // 발신번호(동보전송용)
  var subject = '장문 메시지 제목';        // 메시지 제목(동보전송용)
  var contents = 'MMS 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만세 무궁화 삼천리 화려강산 대한사람 대한으로';  // 메시지 내용(동보전송용), 2000Byte 초과시 길이가 조정되어 전송
  var reserveDT = '';                  // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
  var adsYN = false;                   // 광고문자 전송여부

  var filePaths = ['../테스트.jpg']      // 첨부 파일경로

  var Messages = [
    {
      Sender : '07075103710',         // 발신번호
      Receiver : '000111222',         // 수신번호
      ReceiverName : '수신자명',
      Subject : 'MMS 테스트 제목1',
      Contents :'MMS 전송 테스트 내용1',  // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송
    },
    {
      Sender : '07075103710',         // 발신번호
      Receiver : '000111222',         // 수신번호
      ReceiverName : '수신자명',
      Subject : 'MMS 테스트 제목2',
      Contents :'MMS 전송 테스트 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만 무궁화 삼천리 화려강산 ', // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송
    }
  ]

  messageService.sendMMS_multi(testCorpNum, senderNum, subject, contents, Messages, filePaths, reserveDT, adsYN,
    function(receiptNum){
      res.render('result', {path : req.path, result : receiptNum});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });

});

// 전송내역 목록조회
router.get('/search', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var SDate = '20160101';                  // 검색시작일자
  var EDate = '20160315';                  // 검색종료일자
  var State = [1, 2, 3, 4];                // 전송상태값 배열, 1-대기, 2-성공, 3-실패, 4-취소
  var Item = ['SMS', 'LMS', 'MMS'];        // 검색대상 배열
  var ReserveYN = false;                   // 예약여부, true-예약전송만 조회
  var SenderYN = false;                    // 개인조회여부, true-개인조회
  var Order = 'D';                         // 정렬방향, D-내림차순, A-오름차순
  var Page = 1;                            // 페이지번호
  var PerPage = 100;                        // 페이지 목록개수, 최대 1000건

  messageService.search(testCorpNum, SDate, EDate, State, Item, ReserveYN, SenderYN, Order, Page, PerPage,
    function(result){
      res.render('Message/Search',{path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


// 문자 전송정보 조회
router.get('/getMessages', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var receiptNum = '015081414000000004';   // 문자전송 접수번호

  messageService.getMessages(testCorpNum, receiptNum,
    function(result){
      res.render('Message/SentMessage',{path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 예약문자전송 취소
router.get('/cancelReserve', function(req,res,next){

  var testCorpNum = '1234567890';           // 팝빌회원 사업자번호
  var receiptNum = '015081117000000018';    // 문자전송 접수번호

  messageService.cancelReserve(testCorpNum, receiptNum,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 문자전송내역 조회 팝업 URL
router.get('/getURL', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호, '-' 제외 10자리
  var TOGO = 'BOX';                 // BOX(전송내역조회)
  var testUserID = 'testkorea';     // 팝빌회원 아이디

  messageService.getURL(testCorpNum,TOGO,testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

//문자 전송단가 조회
router.get('/getUnitCost', function(req,res,next){

  var testCorpNum = '1234567890';               // 팝빌회원 사업자번호, '-' 제외 10자리
  var messageType = popbill.MessageType.LMS;    // 문자전송유형, SMS(단문), LMS(장문), MMS(포토)

  messageService.getUnitCost(testCorpNum, messageType,
    function(unitCost){
      res.render('result', { path : req.path, result : unitCost });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

module.exports = router;




