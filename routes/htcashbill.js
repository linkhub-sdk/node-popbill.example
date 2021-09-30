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

    // 팝빌 API 서비스 고정 IP 사용여부
    UseStaticIP: false,

    // 로컬서버 시간 사용여부 true-사용(기본값-권장), false-미사용
    UseLocalTimeYN: true,

    defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

/*
 * 홈택스 현금영수증 API 연계 모듈 초기화
 */
var htCashbillService = popbill.HTCashbillService();

// API List Index
router.get('/', function (req, res, next) {
    res.render('HTCashbill/index', {});
});

/*
 * 홈택스에 신고된 현금영수증 매입/매출 내역 수집을 팝빌에 요청합니다. (조회기간 단위 : 최대 3개월)
 * - https://docs.popbill.com/htcashbill/node/api#RequestJob
 */
router.get('/requestJob', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 현금영수증 유형, SELL-매출, BUY-매입
    var type = popbill.MgtKeyType.SELL;

    // 시작일자, 날짜형식(yyyyMMdd)
    var SDate = '20210801';

    // 종료일자, 날짜형식(yyyyMMdd)
    var EDate = '20210810';

    htCashbillService.requestJob(testCorpNum, type, SDate, EDate,
        function (jobID) {
            res.render('result', {path: req.path, result: jobID})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 함수 RequestJob(수집 요청)를 통해 반환 받은 작업 아이디의 상태를 확인합니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetJobState
 */
router.get('/getJobState', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 작업아이디
    var jobID = '021010912000000058';

    htCashbillService.getJobState(testCorpNum, jobID,
        function (response) {
            res.render('HomeTax/jobState', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 현금영수증 매입/매출 내역 수집요청에 대한 상태 목록을 확인합니다.
 * - 수집 요청 후 1시간이 경과한 수집 요청건은 상태정보가 반환되지 않습니다.
 * - https://docs.popbill.com/htcashbill/node/api#ListActiveJob
 */
router.get('/listActiveJob', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htCashbillService.listActiveJob(testCorpNum,
        function (response) {
            res.render('HomeTax/listActiveJob', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 함수 GetJobState(수집 상태 확인)를 통해 상태 정보 확인된 작업아이디를 활용하여 현금영수증 매입/매출 내역을 조회합니다.
 * - https://docs.popbill.com/htcashbill/node/api#Search
 */
router.get('/search', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 작업아이디
    var jobID = '021010912000000058';

    // 문서형태 배열, N-일반 현금영수증, C-취소 현금영수증
    var tradeType = ['N', 'C'];

    // 거래용도 배열, P-소득공제용, C-지출증빙용
    var tradeUsage = ['P', 'C'];

    // 페이지번호
    var page = 1;

    // 페이지당 검색개수
    var perPage = 10;

    // 정렬방향, D-내림차순, A-오름차순
    var order = 'D';

    htCashbillService.search(testCorpNum, jobID, tradeType, tradeUsage, page, perPage, order,
        function (response) {
            res.render('HTCashbill/search', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 함수 GetJobState(수집 상태 확인)를 통해 상태 정보가 확인된 작업아이디를 활용하여 수집된 현금영수증 매입/매출 내역의 요약 정보를 조회합니다.
 * - https://docs.popbill.com/htcashbill/node/api#Summary
 */
router.get('/summary', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 작업아이디
    var jobID = '021010912000000058';


    // 문서형태 배열, N-일반 현금영수증, C-취소 현금영수증
    var tradeType = ['N', 'C'];

    // 거래용도 배열, P-소득공제용, C-지출증빙용
    var tradeUsage = ['P', 'C'];

    htCashbillService.summary(testCorpNum, jobID, tradeType, tradeUsage,
        function (response) {
            res.render('HTCashbill/summary', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 홈택스연동 인증정보를 관리하는 페이지의 팝업 URL을 반환합니다.
 * - 인증방식에는 부서사용자/공인인증서 인증 방식이 있습니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetCertificatePopUpURL
 */
router.get('/getCertificatePopUpURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htCashbillService.getCertificatePopUpURL(testCorpNum,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 홈택스연동 인증을 위해 팝빌에 등록된 인증서 만료일자를 확인합니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetCertificateExpireDate
 */
router.get('/getCertificateExpireDate', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htCashbillService.getCertificateExpireDate(testCorpNum,
        function (expireDate) {
            res.render('result', {path: req.path, result: expireDate});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌에 등록된 인증서로 홈택스 로그인 가능 여부를 확인합니다.
 * - https://docs.popbill.com/htcashbill/node/api#CheckCertValidation
 */
router.get('/checkCertValidation', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htCashbillService.checkCertValidation(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 홈택스연동 인증을 위해 팝빌에 현금영수증 자료조회 부서사용자 계정을 등록합니다.
 * - https://docs.popbill.com/htcashbill/node/api#RegistDeptUser
 */
router.get('/registDeptUser', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 홈택스에서 생성한 현금영수증 부서사용자 아이디
    var deptUserID = 'userid';

    // 홈택스에서 생성한 현금영수증 부서사용자 비밀번호
    var deptUserPWD = 'passwd';


    htCashbillService.registDeptUser(testCorpNum, deptUserID, deptUserPWD,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 홈택스연동 인증을 위해 팝빌에 등록된 현금영수증 자료조회 부서사용자 계정을 확인합니다.
 * - https://docs.popbill.com/htcashbill/node/api#CheckDeptUser
 */
router.get('/checkDeptUser', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htCashbillService.checkDeptUser(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌에 등록된 현금영수증 자료조회 부서사용자 계정 정보로 홈택스 로그인 가능 여부를 확인합니다.
 * - https://docs.popbill.com/htcashbill/node/api#CheckLoginDeptUser
 */
router.get('/checkLoginDeptUser', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htCashbillService.checkLoginDeptUser(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌에 등록된 홈택스 현금영수증 자료조회 부서사용자 계정을 삭제합니다.
 * - https://docs.popbill.com/htcashbill/node/api#DeleteDeptUser
 */
router.get('/deleteDeptUser', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htCashbillService.deleteDeptUser(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 잔여포인트를 확인합니다.
 * - 과금방식이 파트너과금인 경우 파트너 잔여포인트(GetPartnerBalance API) 를 통해 확인하시기 바랍니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetBalance
 */
router.get('/getBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htCashbillService.getBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetChargeURL
 */
router.get('/getChargeURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htCashbillService.getChargeURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 결제내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetPaymentURL
 */
router.get('/getPaymentURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htCashbillService.getPaymentURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 사용내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetUseHistoryURL
 */
router.get('/getUseHistoryURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htCashbillService.getUseHistoryURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너의 잔여포인트를 확인합니다.
 * - 과금방식이 연동과금인 경우 연동회원 잔여포인트(GetBalance API)를 이용하시기 바랍니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetPartnerBalance
 */
router.get('/getPartnerBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htCashbillService.getPartnerBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetPartnerURL
 */
router.get('/getPartnerURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // CHRG(포인트충전)
    var TOGO = 'CHRG';

    htCashbillService.getPartnerURL(testCorpNum, TOGO,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 홈택스연동(현금) API 서비스 과금정보를 확인합니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetChargeInfo
 */
router.get('/getChargeInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htCashbillService.getChargeInfo(testCorpNum,
        function (result) {
            res.render('Base/getChargeInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 홈택스연동 정액제 서비스 신청 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetFlatRatePopUpURL
 */
router.get('/getFlatRatePopUpURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htCashbillService.getFlatRatePopUpURL(testCorpNum,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 홈택스연동 정액제 서비스 상태를 확인합니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetFlatRateState
 */
router.get('/getFlatRateState', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htCashbillService.getFlatRateState(testCorpNum,
        function (response) {
            res.render('HomeTax/flatRateState', {path: req.path, result: response});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 사업자번호를 조회하여 연동회원 가입여부를 확인합니다.
 * - https://docs.popbill.com/htcashbill/node/api#CheckIsMember
 */
router.get('/checkIsMember', function (req, res, next) {

    // 조회할 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htCashbillService.checkIsMember(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 사용하고자 하는 아이디의 중복여부를 확인합니다.
 * - https://docs.popbill.com/htcashbill/node/api#CheckID
 */
router.get('/checkID', function (req, res, next) {

    // 조회할 아이디
    var testID = 'testkorea';

    htCashbillService.checkID(testID,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 사용자를 연동회원으로 가입처리합니다.
 * - https://docs.popbill.com/htcashbill/node/api#JoinMember
 */
router.get('/joinMember', function (req, res, next) {

    // 회원정보
    var joinInfo = {

        // 회원 아이디 (6자 이상 50자 미만)
        ID: 'userid',

        // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
        Password: 'asdf8536!@#',

        // 링크아이디
        LinkID: htCashbillService._config.LinkID,

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

    htCashbillService.joinMember(joinInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 사이트에 로그인 상태로 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetAccessURL
 */
router.get('/getAccessURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htCashbillService.getAccessURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 확인합니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetCorpInfo
 */
router.get('/getCorpInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htCashbillService.getCorpInfo(testCorpNum,
        function (result) {
            res.render('Base/getCorpInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 수정합니다
 * - https://docs.popbill.com/htcashbill/node/api#UpdateCorpInfo
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

    htCashbillService.updateCorpInfo(testCorpNum, corpInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 담당자(팝빌 로그인 계정)를 추가합니다.
 * - https://docs.popbill.com/htcashbill/node/api#RegistContact
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

    htCashbillService.registContact(testCorpNum, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보을 확인합니다.
 * - https://docs.popbill.com/htcashbill/node/api#GetContactInfo
 */
router.get('/getContactInfo', function (req, res, next) {

    // 팝빌회원 사업자번호
    var testCorpNum = '1234567890';

    // 확인할 담당자 아이디
    var contactID = 'checkContactID';

    htCashbillService.getContactInfo(testCorpNum, contactID,
        function (result) {
            res.render('Base/getContactInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 목록을 확인합니다.
 * - https://docs.popbill.com/htcashbill/node/api#ListContact
 */
router.get('/listContact', function (req, res, next) {

    // 조회할 아이디
    var testCorpNum = '1234567890';

    htCashbillService.listContact(testCorpNum,
        function (result) {
            res.render('Base/listContact', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보를 수정합니다.
 * - https://docs.popbill.com/htcashbill/node/api#UpdateContact
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

    htCashbillService.updateContact(testCorpNum, testUserID, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

module.exports = router;
