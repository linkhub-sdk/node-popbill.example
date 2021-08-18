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
 * 홈택스 전자세금계산서 API 연계 모듈 초기화
 */
var htTaxinvoiceService = popbill.HTTaxinvoiceService();

// API List Index
router.get('/', function (req, res, next) {
    res.render('HTTaxinvoice/index', {});
});

/*
 * 홈택스에 신고된 전자세금계산서 매입/매출 내역 수집을 팝빌에 요청합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#RequestJob
 */
router.get('/requestJob', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 세금계산서 유형, SELL-매출, BUY-매입, TRUSTEE-수탁
    var type = popbill.MgtKeyType.SELL;

    // 검색일자유형, W-작성일자, I-발행일자, S-전송일자
    var DType = 'S';

    // 시작일자, 날짜형식(yyyyMMdd)
    var SDate = '20210801';

    // 종료일자, 날짜형식(yyyyMMdd)
    var EDate = '20210810';

    htTaxinvoiceService.requestJob(testCorpNum, type, DType, SDate, EDate,
        function (jobID) {
            res.render('result', {path: req.path, result: jobID})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 함수 RequestJob(수집 요청)를 통해 반환 받은 작업 아이디의 상태를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetJobState
 */
router.get('/getJobState', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 작업아이디
    var jobID = '021121721000000002';

    htTaxinvoiceService.getJobState(testCorpNum, jobID,
        function (response) {
            res.render('HomeTax/jobState', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 전자세금계산서 매입/매출 내역 수집요청에 대한 상태 목록을 확인합니다.
 * - 수집 요청 후 1시간이 경과한 수집 요청건은 상태정보가 반환되지 않습니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#ListActiveJob
 */
router.get('/listActiveJob', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.listActiveJob(testCorpNum,
        function (response) {
            res.render('HomeTax/listActiveJob', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 함수 GetJobState(수집 상태 확인)를 통해 상태 정보가 확인된 작업아이디를 활용하여 수집된 전자세금계산서 매입/매출 내역을 조회합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#Search
 */
router.get('/search', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = '';

    // 작업아이디
    var jobID = '021121721000000002';

    // 문서형태 배열, N-일반 세금계산서, M-수정세금계산서
    var type = ['N', 'M'];

    // 과세형태 배열, T-과세, N-면세, Z-영세
    var taxType = ['T', 'N', 'Z'];

    // 영수/청구 배열, R-영수, C-청구, N-없음
    var purposeType = ['R', 'C', 'N'];


    // 종사업장 사업자유형, S-공급자, B-공급받는자, T-수탁자
    var taxRegIDType = 'S';

    // 종사업장번호 유무, 공백-전체조회, 0-종사업장번호 없음, 1-종사업장번호 있음
    var taxRegIDYN = '';

    // 종사업장번호, 콤마(',')로 구분하여 구성, ex) '1234,0007';
    var taxRegID = '';


    // 페이지번호
    var page = 1;

    // 페이지당 검색개수
    var perPage = 10;

    // 정렬방향, D-내림차순, A-오름차순
    var order = 'D';

    // 조회 검색어, 거래처 사업자번호 또는 거래처명 like 검색
    var searchString = '';

    htTaxinvoiceService.search(testCorpNum, jobID, type, taxType, purposeType, taxRegIDType,
        taxRegIDYN, taxRegID, page, perPage, order, testUserID, searchString,
        function (response) {
            res.render('HTTaxinvoice/search', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 함수 GetJobState(수집 상태 확인)를 통해 상태 정보가 확인된 작업아이디를 활용하여 수집된 전자세금계산서 매입/매출 내역의 요약 정보를 조회합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#Summary
 */
router.get('/summary', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = '';

    // 작업아이디
    var jobID = '021103109000000121';

    // 문서형태 배열, N-일반 세금계산서, M-수정세금계산서
    var type = ['N', 'M'];

    // 과세형태 배열, T-과세, N-면세, Z-영세
    var taxType = ['T', 'N', 'Z'];

    // 영수/청구 배열, R-영수, C-청구, N-없음
    var purposeType = ['R', 'C', 'N'];

    // 종사업장 사업자유형, S-공급자, B-공급받는자, T-수탁자
    var taxRegIDType = 'S';

    var taxRegIDYN = '';

    // 종사업장번호, 콤마(',')로 구분하여 구성, ex) '1234,0007';
    var taxRegID = '';

    // 조회 검색어, 거래처 사업자번호 또는 거래처명 like 검색
    var searchString = '';

    htTaxinvoiceService.summary(testCorpNum, jobID, type, taxType, purposeType,
        taxRegIDType, taxRegIDYN, taxRegID, testUserID, searchString,
        function (response) {
            res.render('HTTaxinvoice/summary', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 국세청 승인번호를 통해 수집한 전자세금계산서 1건의 상세정보를 반환합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetTaxinvoice
 */
router.get('/getTaxinvoice', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 전자세금계산서 국세청 승인번호
    var ntsconfirmNum = '202101074100020300000ecd';

    htTaxinvoiceService.getTaxinvoice(testCorpNum, ntsconfirmNum,
        function (response) {
            res.render('HTTaxinvoice/getTaxinvoice', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 국세청 승인번호를 통해 수집한 전자세금계산서 1건의 상세정보를 XML 형태의 문자열로 반환합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetXML
 */
router.get('/getXML', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 전자세금계산서 국세청 승인번호
    var ntsconfirmNum = '202101074100020300000ecd';

    htTaxinvoiceService.getXML(testCorpNum, ntsconfirmNum,
        function (response) {
            res.render('HTTaxinvoice/getXML', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 수집된 전자세금계산서 1건의 상세내역을 확인하는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetPopUpURL
 */
router.get('/getPopUpURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 국세청승인번호
    var NTSConfirmNum = '202101074100020300000ecd';

    htTaxinvoiceService.getPopUpURL(testCorpNum, NTSConfirmNum,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 수집된 전자세금계산서 1건의 상세내역을 인쇄하는 페이지의 URL을 반환합니다
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetPrintURL
 */
router.get('/getPrintURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 국세청승인번호
    var NTSConfirmNum = '202101074100020300000ecd';

    htTaxinvoiceService.getPrintURL(testCorpNum, NTSConfirmNum,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 홈택스연동 인증정보를 관리하는 페이지의 팝업 URL을 반환합니다.
 * - 인증방식에는 부서사용자/공인인증서 인증 방식이 있습니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetCertificatePopUpURL
 */
router.get('/getCertificatePopUpURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.getCertificatePopUpURL(testCorpNum,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 홈택스연동 인증을 위해 팝빌에 등록된 인증서 만료일자를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetCertificateExpireDate
 */
router.get('/getCertificateExpireDate', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.getCertificateExpireDate(testCorpNum,
        function (expireDate) {
            res.render('result', {path: req.path, result: expireDate});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌에 등록된 인증서로 홈택스 로그인 가능 여부를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#CheckCertValidation
 */
router.get('/checkCertValidation', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.checkCertValidation(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 홈택스연동 인증을 위해 팝빌에 전자세금계산서용 부서사용자 계정을 등록합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#RegistDeptUser
 */
router.get('/registDeptUser', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 홈택스에서 생성한 전자세금계산서 부서사용자 아이디
    var deptUserID = 'userid';

    // 홈택스에서 생성한 전자세금계산서 부서사용자 비밀번호
    var deptUserPWD = 'passwd';


    htTaxinvoiceService.registDeptUser(testCorpNum, deptUserID, deptUserPWD,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 홈택스연동 인증을 위해 팝빌에 등록된 전자세금계산서용 부서사용자 계정을 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#CheckDeptUser
 */
router.get('/checkDeptUser', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.checkDeptUser(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌에 등록된 전자세금계산서용 부서사용자 계정 정보로 홈택스 로그인 가능 여부를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#CheckLoginDeptUser
 */
router.get('/checkLoginDeptUser', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.checkLoginDeptUser(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌에 등록된 홈택스 전자세금계산서용 부서사용자 계정을 삭제합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#DeleteDeptUser
 */
router.get('/deleteDeptUser', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.deleteDeptUser(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 잔여포인트를 확인합니다.
 * - 과금방식이 파트너과금인 경우 파트너 잔여포인트(GetPartnerBalance API) 를 통해 확인하시기 바랍니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetBalance
 */
router.get('/getBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.getBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetChargeURL
 */
router.get('/getChargeURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htTaxinvoiceService.getChargeURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 결제내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetPaymentURL
 */
router.get('/getPaymentURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htTaxinvoiceService.getPaymentURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 사용내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetUseHistoryURL
 */
router.get('/getUseHistoryURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htTaxinvoiceService.getUseHistoryURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너의 잔여포인트를 확인합니다.
 * - 과금방식이 연동과금인 경우 연동회원 잔여포인트(GetBalance API)를 이용하시기 바랍니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetPartnerBalance
 */
router.get('/getPartnerBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.getPartnerBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetPartnerURL
 */
router.get('/getPartnerURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // CHRG(포인트충전)
    var TOGO = 'CHRG';

    htTaxinvoiceService.getPartnerURL(testCorpNum, TOGO,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 홈택스연동(세금) API 서비스 과금정보를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetChargeInfo
 */
router.get('/getChargeInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.getChargeInfo(testCorpNum,
        function (result) {
            res.render('Base/getChargeInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 홈택스연동 정액제 서비스 신청 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetFlatRatePopUpURL
 */
router.get('/getFlatRatePopUpURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.getFlatRatePopUpURL(testCorpNum,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 홈택스연동 정액제 서비스 상태를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetFlatRateState
 */
router.get('/getFlatRateState', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.getFlatRateState(testCorpNum,
        function (response) {
            res.render('HomeTax/flatRateState', {path: req.path, result: response});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 사업자번호를 조회하여 연동회원 가입여부를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#CheckIsMember
 */
router.get('/checkIsMember', function (req, res, next) {

    // 조회할 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.checkIsMember(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 사용하고자 하는 아이디의 중복여부를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#CheckID
 */
router.get('/checkID', function (req, res, next) {

    // 조회할 아이디
    var testID = 'testkorea';

    htTaxinvoiceService.checkID(testID,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 사용자를 연동회원으로 가입처리합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#JoinMember
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

    htTaxinvoiceService.joinMember(joinInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 사이트에 로그인 상태로 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetAccessURL
 */
router.get('/getAccessURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htTaxinvoiceService.getAccessURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 담당자(팝빌 로그인 계정)를 추가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#RegistContact
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

    htTaxinvoiceService.registContact(testCorpNum, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 목록을 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#ListContact
 */
router.get('/listContact', function (req, res, next) {

    // 조회할 아이디
    var testCorpNum = '1234567890';

    htTaxinvoiceService.listContact(testCorpNum,
        function (result) {
            res.render('Base/listContact', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보를 수정합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#UpdateContact
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

    htTaxinvoiceService.updateContact(testCorpNum, testUserID, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetCorpInfo
 */
router.get('/getCorpInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.getCorpInfo(testCorpNum,
        function (result) {
            res.render('Base/getCorpInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 수정합니다
 * - https://docs.popbill.com/httaxinvoice/node/api#UpdateCorpInfo
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

    htTaxinvoiceService.updateCorpInfo(testCorpNum, corpInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

module.exports = router;
