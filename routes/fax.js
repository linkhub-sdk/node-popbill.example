var express = require('express');
var router = express.Router();
var popbill = require('popbill');
var https = require('https');

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
 * 팩스 API 서비스 클래스 생성
 */
var faxService = popbill.FaxService();

/*
 * Fax API Index 목록
 */
router.get('/', function (req, res, next) {
    res.render('Fax/index', {});
});

/*
 * 발신번호를 등록하고 내역을 확인하는 팩스 발신번호 관리 페이지 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/fax/node/api#GetSenderNumberMgtURL
 */
router.get('/getSenderNumberMgtURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    faxService.getSenderNumberMgtURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌에 등록한 연동회원의 팩스 발신번호 목록을 확인합니다.
 * - https://docs.popbill.com/fax/node/api#GetSenderNumberList
 */
router.get('/getSenderNumberList', function (req, res, next) {

    // 조회할 아이디
    var testCorpNum = '1234567890';

    faxService.getSenderNumberList(testCorpNum,
        function (result) {
            res.render('Fax/SenderNumberList', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팩스 1건을 전송합니다. (최대 전송파일 개수: 20개)
 * - 팩스전송 문서 파일포맷 안내 : https://docs.popbill.com/fax/format?lang=node
 * - https://docs.popbill.com/fax/node/api#SendFAX
 */
router.get('/sendFAX', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발신번호
    var senderNum = '07043042991';

    // 발신자명
    var senderName = '발신자명';

    // 광고팩스 전송여부
    var adsYN = false;

    // 수신팩스번호
    var receiveNum = '070111222';

    // 수신자명
    var receiveName = '수신자명';

    // 파일경로 배열, 전송개수 촤대 20개
    var filePaths = ['test.jpg'];

    // 팩스제목
    var title = '팩스전송';

    // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    // 팝빌회원 아이디
    var userID = "testkorea";

    faxService.sendFax(testCorpNum, senderNum, receiveNum, receiveName, filePaths, reserveDT, senderName, adsYN, title, requestNum, userID,
        function (receiptNum) {
            res.render('result', {path: req.path, result: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 동일한 팩스파일을 다수의 수신자에게 전송하기 위해 팝빌에 접수합니다. (최대 1,000건)
 * - 팩스전송 문서 파일포맷 안내 : https://docs.popbill.com/fax/format?lang=node
 * - https://docs.popbill.com/fax/node/api#sendFAX_multi
 */
router.get('/sendFAX_multi', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발신번호
    var senderNum = '07043042991';

    // 발신자명
    var senderName = '발신자명';

    // 파일경로 배열, 전송개수 촤대 20개
    var filePaths = ['test.jpg', 'test.jpg'];

    // 수신자정보 배열, 최대 1000건
    var Receivers = [
        {
            receiveName: '수신자명1',      // 수신자명
            receiveNum: '070111222',     // 수신팩스번호
        },
        {
            receiveName: '수신자명2',
            receiveNum: '070111222',
        }
    ];

    // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 광고팩스 전송여부
    var adsYN = false;

    // 팩스제목
    var title = '팩스대량전송';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    // 팝빌회원 아이디
    var userID = "testkorea";

    faxService.sendFax(testCorpNum, senderNum, Receivers, "", filePaths, reserveDT, senderName, adsYN, title, requestNum, userID,
        function (receiptNum) {
            res.render('result', {path: req.path, result: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 전송할 파일의 바이너리 데이터를 팩스 1건 전송합니다. (최대 전송파일 개수: 20개)
 * - https://docs.popbill.com/fax/node/api#SendFaxBinary
 */
router.get('/sendFAXBinary', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발신번호
    var senderNum = '07043042991';

    // 발신자명
    var senderName = '발신자명';

    // 광고팩스 전송여부
    var adsYN = false;

    // 수신팩스번호
    var receiveNum = '070111222';

    // 수신자명
    var receiveName = '수신자명';

    // 팩스제목
    var title = '팩스전송';

    // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    // 팝빌회원 아이디
    var userID = "testkorea";


    var targeturl = "https://d17ecin4ilxxme.cloudfront.net/notice/20210801_01.jpg";

    https.get(targeturl, function(response) {
      var data = [];
      response.on('data', function(chunk) {
        data.push(chunk);
      }).on('end', function() {

        if(response.statusCode == 200) {
          var binary = Buffer.concat(data);

          // Binary 파일정보 배열, 전송개수 촤대 20개
          var BinaryFiles = []
          BinaryFiles.push(
            {
              // 파일명
              fileName: '20210801_01.jpg',
              // 파일데이터
              fileData: binary
            }
          );

          BinaryFiles.push({fileName: '20210801_01.jpg', fileData: binary});

          faxService.sendFaxBinary(testCorpNum, senderNum, receiveNum, receiveName, BinaryFiles, reserveDT, senderName, adsYN, title, requestNum, userID,
              function (receiptNum) {
                  res.render('result', {path: req.path, result: receiptNum});
              }, function (Error) {
                  res.render('response', {path: req.path, code: Error.code, message: Error.message});
              });

        } else {
            res.render('response', {path: req.path, code: -99999999, message: response.statusCode});
        }

      })
    }).on('error', function(err) {
        res.render('response', {path: req.path, code: -99999999, message: err.message});
    });
});

/*
 * 팝빌에서 반환받은 접수번호를 통해 팩스 1건을 재전송합니다.
 * - 발신/수신 정보 미입력시 기존과 동일한 정보로 팩스가 전송되고, 접수일 기준 최대 60일이 경과되지 않는 건만 재전송이 가능합니다.
 * - 팩스 재전송 요청시 포인트가 차감됩니다. (전송실패시 환불처리)
 * - https://docs.popbill.com/fax/node/api#ResendFAX
 */
router.get('/resendFAX', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팩스 접수번호
    var receiptNum = '021032511132400001';

    // 발신번호, 공백처리시 기존전송정보로 재전송
    var senderNum = '07043042991';

    // 발신자명, 공백처리시 기존전송정보로 재전송
    var senderName = '발신자명';

    // 수신팩스번호/수신자명 모두
    // 수신번호
    var receiveNum = '';

    // 수신자명
    var receiveName = '';

    // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 팩스제목
    var title = '팩스재전송';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    // 팝빌회원 아이디
    var userID = "testkorea";

    faxService.resendFax(testCorpNum, receiptNum, senderNum, senderName, receiveNum, receiveName, reserveDT, title, requestNum, userID,
        function (receiptNum) {
            res.render('result', {path: req.path, result: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너가 할당한 전송요청 번호를 통해 팩스 1건을 재전송합니다.
 * - 발신/수신 정보 미입력시 기존과 동일한 정보로 팩스가 전송되고, 접수일 기준 최대 60일이 경과되지 않는 건만 재전송이 가능합니다.
 * - 팩스 재전송 요청시 포인트가 차감됩니다. (전송실패시 환불처리)
 * - https://docs.popbill.com/fax/node/api#ResendFAXRN
 */
router.get('/resendFAXRN', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 원본 팩스 전송시 할당한 전송요청번호(requestNum)
    var orgRequestNum = '20210801-001';

    // 발신번호, 공백처리시 기존전송정보로 재전송
    var senderNum = '';

    // 발신자명, 공백처리시 기존전송정보로 재전송
    var senderName = '';

    // 수신번호
    var receiveNum = '';

    // 수신자명
    var receiveName = '';

    // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 팩스제목
    var title = '팩스재전송 (요청번호할당)';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var reqeustNum = '';

    // 팝빌회원 아이디
    var userID = "testkorea";

    faxService.resendFaxRN(testCorpNum, orgRequestNum, senderNum, senderName, receiveNum, receiveName, reserveDT, title, reqeustNum, userID,
        function (receiptNum) {
            res.render('result', {path: req.path, result: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 동일한 팩스파일을 다수의 수신자에게 전송하기 위해 팝빌에 접수합니다. (최대 전송파일 개수: 20개) (최대 1,000건)
 * - 발신/수신 정보 미입력시 기존과 동일한 정보로 팩스가 전송되고, 접수일 기준 최대 60일이 경과되지 않는 건만 재전송이 가능합니다.
 * - 팩스 재전송 요청시 포인트가 차감됩니다. (전송실패시 환불처리)
 * - https://docs.popbill.com/fax/node/api#ResendFAX_multi
 */
router.get('/resendFAX_multi', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팩스 접수번호
    var receiptNum = '021032510182200001';

    // 발신번호, 공백처리시 기존전송정보로 재전송
    var senderNum = '';

    // 발신자명, 공백처리시 기존전송정보로 재전송
    var senderName = '';

    //수신자정보 배열, 최대 1000건
    var Receivers = [
        {
            receiveName: '수신자명1',      // 수신자명
            receiveNum: '111222333',     // 수신팩스번호
        },
        {
            receiveName: '수신자명2',
            receiveNum: '000111222',
        }
    ]

    // 수신자정보를 기존전송정보와 동일하게 재전송하는 경우 아래코드 적용
    //var Receivers = null;

    // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 팩스제목
    var title = '팩스재전송 대량 전송';

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var reqeustNum = '';

    // 팝빌회원 아이디
    var userID = "testkorea";

    faxService.resendFax(testCorpNum, receiptNum, senderNum, senderName, Receivers, "", reserveDT, title, reqeustNum, userID,
        function (receiptNum) {
            res.render('result', {path: req.path, result: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너가 할당한 전송요청 번호를 통해 다수건의 팩스를 재전송합니다. (최대 전송파일 개수: 20개) (최대 1,000건)
 * - 발신/수신 정보 미입력시 기존과 동일한 정보로 팩스가 전송되고, 접수일 기준 최대 60일이 경과되지 않는 건만 재전송이 가능합니다.
 * - 팩스 재전송 요청시 포인트가 차감됩니다. (전송실패시 환불처리)
 * - https://docs.popbill.com/fax/node/api#ResendFAXRN_multi
 */
router.get('/resendFAXRN_multi', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 원본 팩스 전송시 할당한 전송요청번호(requestNum)
    var orgRequestNum = '20210801-001';

    // 발신번호, 공백처리시 기존전송정보로 재전송
    var senderNum = '';

    // 발신자명, 공백처리시 기존전송정보로 재전송
    var senderName = '';

    //수신자정보 배열, 최대 1000건
    var Receivers = [
        {
            receiveName: '수신자명1',      // 수신자명
            receiveNum: '111222333',     // 수신팩스번호
        },
        {
            receiveName: '수신자명2',
            receiveNum: '000111222',
        }
    ]
    // 수신자정보를 기존전송정보와 동일하게 재전송하는 경우 아래코드 적용
    //var Receivers = null;

    // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';

    // 팩스제목
    var title = '팩스재전송 대량 전송 (요청번호할당)';

    // 팩스 접수번호
    var reqeustNum = '';

    // 팝빌회원 아이디
    var userID = "testkorea";

    faxService.resendFaxRN(testCorpNum, orgRequestNum, senderNum, senderName, Receivers, "", reserveDT, title, reqeustNum, userID,
        function (receiptNum) {
            res.render('result', {path: req.path, result: receiptNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌에서 반환받은 접수번호를 통해 예약접수된 팩스 전송을 취소합니다. (예약시간 10분 전까지 가능)
 * - https://docs.popbill.com/fax/node/api#CancelReserve
 */
router.get('/cancelReserve', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팩스전송 접수번호
    var receiptNum = '018092811330600001';

    faxService.cancelReserve(testCorpNum, receiptNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너가 할당한 전송요청 번호를 통해 예약접수된 팩스 전송을 취소합니다. (예약시간 10분 전까지 가능)
 * - https://docs.popbill.com/fax/node/api#CancelReserveRN
 */
router.get('/cancelReserveRN', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팩스전송 요청번호
    var requestNum = '20210801-001';

    faxService.cancelReserveRN(testCorpNum, requestNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌에서 반환 받은 접수번호를 통해 팩스 전송상태 및 결과를 확인합니다.
 * - https://docs.popbill.com/fax/node/api#GetFaxResult
 */
router.get('/getFaxResult', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팩스전송 접수번호
    var receiptNum = '021010912104300001';

    faxService.getFaxResult(testCorpNum, receiptNum,
        function (result) {
            res.render('Fax/FaxResult', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너가 할당한 전송요청 번호를 통해 팩스 전송상태 및 결과를 확인합니다.
 * - https://docs.popbill.com/fax/node/api#GetFaxResultRN
 */
router.get('/getFaxResultRN', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팩스전송 요청번호
    var requestNum = '20210801-001';

    faxService.getFaxResultRN(testCorpNum, requestNum,
        function (result) {
            res.render('Fax/FaxResult', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 검색조건에 해당하는 팩스 전송내역 목록을 조회합니다. (최대 검색기간 : 2개월)
 * - https://docs.popbill.com/fax/node/api#Search
 */
router.get('/search', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 시작일자, 날짜형식(yyyyMMdd)
    var SDate = '20210801';

    // 종료일자, 날짜형식(yyyyMMdd)
    var EDate = '20210810';

    // 전송상태값 배열, 1-대기, 2-성공, 3-실패, 4-취소
    var State = [1, 2, 3, 4];

    // 예약여부, true-예약전송건 조회, false-전체조회
    var ReserveYN = false;

    // 개인조회여부, true-개인조회, false-회사조회
    var SenderOnly = false;

    // 정렬방향, D-내림차순, A-오름차순
    var Order = 'D';

    // 페이지 번호
    var Page = 1;

    // 페이지당 검색개수, 최대 1000건
    var PerPage = 10;

    // 조회 검색어.
    // 팩스 전송시 입력한 발신자명 또는 수신자명 기재.
    // 조회 검색어를 포함한 발신자명 또는 수신자명을 검색합니다.
    var QString = '';

    faxService.search(testCorpNum, SDate, EDate, State, ReserveYN, SenderOnly, Order, Page, PerPage, QString,
        function (result) {
            res.render('Fax/Search', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 사이트와 동일한 팩스 전송내역 확인 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/fax/node/api#GetSentListURL
 */
router.get('/getSentListURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    faxService.getSentListURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팩스 미리보기 팝업 URL을 반환하며, 팩스전송을 위한 TIF 포맷 변환 완료 후 호출 할 수 있습니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/fax/node/api#GetPreviewURL
 */
router.get('/getPreviewURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팩스 접수번호
    var receiptNum = '018091015373100001';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    faxService.getPreviewURL(testCorpNum, receiptNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 잔여포인트를 확인합니다.
 * - 과금방식이 파트너과금인 경우 파트너 잔여포인트(GetPartnerBalance API) 를 통해 확인하시기 바랍니다.
 * - https://docs.popbill.com/fax/node/api#GetBalance
 */
router.get('/getBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    faxService.getBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/fax/node/api#GetChargeURL
 */
router.get('/getChargeURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    faxService.getChargeURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 결제내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/fax/node/api#GetPaymentURL
 */
router.get('/getPaymentURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    faxService.getPaymentURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 사용내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/fax/node/api#GetUseHistoryURL
 */
router.get('/getUseHistoryURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    faxService.getUseHistoryURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너의 잔여포인트를 확인합니다.
 * - 과금방식이 연동과금인 경우 연동회원 잔여포인트(GetBalance API)를 이용하시기 바랍니다.
 * - https://docs.popbill.com/fax/node/api#GetPartnerBalance
 */
router.get('/getPartnerBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    faxService.getPartnerBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/fax/node/api#GetPartnerURL
 */
router.get('/getPartnerURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // CHRG(포인트충전)
    var TOGO = 'CHRG';

    faxService.getPartnerURL(testCorpNum, TOGO,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팩스 전송시 과금되는 포인트 단가를 확인합니다.
 * - https://docs.popbill.com/fax/node/api#GetUnitCost
 */
router.get('/getUnitCost', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    faxService.getUnitCost(testCorpNum,
        function (unitCost) {
            res.render('result', {path: req.path, result: unitCost});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 팩스 API 서비스 과금정보를 확인합니다.
 * - https://docs.popbill.com/fax/node/api#GetChargeInfo
 */
router.get('/getChargeInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    faxService.getChargeInfo(testCorpNum,
        function (result) {
            res.render('Base/getChargeInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 사업자번호를 조회하여 연동회원 가입여부를 확인합니다.
 * - https://docs.popbill.com/fax/node/api#CheckIsMember
 */
router.get('/checkIsMember', function (req, res, next) {

    // 조회할 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    faxService.checkIsMember(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {code: Error.code, message: Error.message});
        });
});

/*
 * 사용하고자 하는 아이디의 중복여부를 확인합니다.
 * - https://docs.popbill.com/fax/node/api#CheckID
 */
router.get('/checkID', function (req, res, next) {

    // 조회할 아이디
    var testID = 'testkorea';

    faxService.checkID(testID,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 사용자를 연동회원으로 가입처리합니다.
 * - https://docs.popbill.com/fax/node/api#JoinMember
 */
router.get('/joinMember', function (req, res, next) {

    // 회원정보
    var joinInfo = {

        // 회원 아이디 (6자 이상 50자 미만)
        ID: 'userid',

        // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
        Password: 'asdf8536!@#',

        // 링크아이디
        LinkID: 'TESTER',

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

    faxService.joinMember(joinInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 사이트에 로그인 상태로 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/fax/node/api#GetAccessURL
 */
router.get('/getAccessURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    faxService.getAccessURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 담당자(팝빌 로그인 계정)를 추가합니다.
 * - https://docs.popbill.com/fax/node/api#RegistContact
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

    faxService.registContact(testCorpNum, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 목록을 확인합니다.
 * - https://docs.popbill.com/fax/node/api#ListContact
 */
router.get('/listContact', function (req, res, next) {

    // 조회할 아이디
    var testCorpNum = '1234567890';

    faxService.listContact(testCorpNum,
        function (result) {
            res.render('Base/listContact', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보를 수정합니다.
 * - https://docs.popbill.com/fax/node/api#UpdateContact
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

    faxService.updateContact(testCorpNum, testUserID, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 확인합니다.
 * - https://docs.popbill.com/fax/node/api#GetCorpInfo
 */
router.get('/getCorpInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    faxService.getCorpInfo(testCorpNum,
        function (result) {
            res.render('Base/getCorpInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 수정합니다
 * - https://docs.popbill.com/fax/node/api#UpdateCorpInfo
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

    faxService.updateCorpInfo(testCorpNum, corpInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

module.exports = router;
