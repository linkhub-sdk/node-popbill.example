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

    defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

/*
 * 예금주조회 API 모듈초기화
 */
var accountCheckService = popbill.AccountCheckService();

router.get('/', function (req, res, next) {
    res.render('AccountCheck/index', {});
});

/*
 * 1건의 계좌에 대한 예금주성명을 조회합니다.
 */
router.get('/checkAccountInfo', function (req, res, next) {


  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 기관코드
  var bankCode = '0004';

  // 계좌번호
  var accountNumber = '9432451175812';

  accountCheckService.checkAccountInfo(testCorpNum, bankCode, accountNumber,
      function (returnObj) {
          res.render('AccountCheck/CheckAccountInfo', {path: req.path, result: returnObj});
      }, function (Error) {
          res.render('response', {path: req.path, code: Error.code, message: Error.message});
      });

});


/*
 * 연동회원의 잔여포인트를 확인합니다.
 * - 과금방식이 파트너과금인 경우 파트너 잔여포인트(GetPartnerBalance API)를 통해 확인하시기 바랍니다.
 */
router.get('/getBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    accountCheckService.getBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 연동회원 포인트 충전 URL을 반환합니다.
 * - 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
 */
router.get('/getChargeURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    accountCheckService.getChargeURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너의 잔여포인트를 확인합니다.
 * - 과금방식이 연동과금인 경우 연동회원 잔여포인트(GetBalance API)를 이용하시기 바랍니다.
 */
router.get('/getPartnerBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    accountCheckService.getPartnerBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너 포인트 충전 팝업 URL을 반환합니다.
 * - 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
 */
router.get('/getPartnerURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // CHRG(포인트충전)
    var TOGO = 'CHRG';

    accountCheckService.getPartnerURL(testCorpNum, TOGO,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 예금주조회 단가를 확인합니다.
 */
router.get('/getUnitCost', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    accountCheckService.getUnitCost(testCorpNum,
        function (unitCost) {
            res.render('result', {path: req.path, result: unitCost});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 예금주조회 API 서비스 과금정보를 확인합니다.
 */
router.get('/getChargeInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    accountCheckService.getChargeInfo(testCorpNum,
        function (result) {
            res.render('Base/getChargeInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 해당 사업자의 파트너 연동회원 가입여부를 확인합니다.
 */
router.get('/checkIsMember', function (req, res, next) {

    // 조회할 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    accountCheckService.checkIsMember(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 회원아이디 중복여부를 확인합니다.
 */
router.get('/checkID', function (req, res, next) {

    // 조회할 아이디
    var testID = 'testkorea';

    accountCheckService.checkID(testID,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 연동회원 가입을 요청합니다.
 */
router.get('/joinMember', function (req, res, next) {

    // 회원정보
    var joinInfo = {

        // 회원 아이디 (6자 이상 50자 미만)
        ID: 'userid',

        // 회원 비밀번호 (6자 이상 20자 미만)
        PWD: 'this_is_password',

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

    accountCheckService.joinMember(joinInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 담당자를 신규로 등록합니다.
 */
router.get('/registContact', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 담당자 정보
    var contactInfo = {

        // 아이디 (6자 이상 50자 미만)
        id: 'testkorea03033',

        // 비밀번호 (6자 이상 20자 미만)
        pwd: 'thisispassword',

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

        // 전체조회여부, 회사조회(true), 개인조회(false)
        searchAllAllowYN: true

    };

    accountCheckService.registContact(testCorpNum, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 담당자 목록을 확인합니다.
 */
router.get('/listContact', function (req, res, next) {

    // 조회할 아이디
    var testCorpNum = '1234567890';

    accountCheckService.listContact(testCorpNum,
        function (result) {
            res.render('Base/listContact', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 담당자 정보를 수정합니다.
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

        // 전체조회여부, 회사조회(true), 개인조회(false)
        searchAllAllowYN: true

    };

    accountCheckService.updateContact(testCorpNum, testUserID, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 확인합니다.
 */
router.get('/getCorpInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    accountCheckService.getCorpInfo(testCorpNum,
        function (result) {
            res.render('Base/getCorpInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 수정합니다
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

    accountCheckService.updateCorpInfo(testCorpNum, corpInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌(www.popbill.com)에 로그인된 팝빌 URL을 반환합니다.
 * - 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
 */
router.get('/getAccessURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    accountCheckService.getAccessURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

module.exports = router;
