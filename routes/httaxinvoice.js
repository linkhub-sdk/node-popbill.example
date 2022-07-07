var express = require('express');
var router = express.Router();
var popbill = require('popbill');

/*
 * 홈택스 전자세금계산서 API 모듈 초기화
 */
var htTaxinvoiceService = popbill.HTTaxinvoiceService();

/*
 * HTTaxinvoice API Index 목록
 */
router.get('/', function(req, res, next) {
    res.render('HTTaxinvoice/index', {});
});

/*
 * 홈택스에 신고된 전자세금계산서 매입/매출 내역 수집을 팝빌에 요청합니다. (조회기간 단위 : 최대 3개월)
 * - 주기적으로 자체 DB에 세금계산서 정보를 INSERT 하는 경우, 조회할 일자 유형(DType) 값을 "S"로 하는 것을 권장합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#RequestJob
 */
router.get('/requestJob', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 전자세금계산서 유형 SELL-매출, BUY-매입, TRUSTEE-위수탁
    var type = popbill.MgtKeyType.SELL;

    // 일자유형, W-작성일자, I-발행일자, S-전송일자
    var DType = 'S';

    // 시작일자, 날짜형식(yyyyMMdd)
    var SDate = '20220601';

    // 종료일자, 날짜형식(yyyyMMdd)
    var EDate = '20220629';

    htTaxinvoiceService.requestJob(testCorpNum, type, DType, SDate, EDate,
        function(jobID) {
            res.render('result', {
                path: req.path,
                result: jobID
            })
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 수집 요청(RequestJob API) 함수를 통해 반환 받은 작업 아이디의 상태를 확인합니다.
 * - 수집 결과 조회(Search API) 함수 또는 수집 결과 요약 정보 조회(Summary API) 함수를 사용하기 전에
 *   수집 작업의 진행 상태, 수집 작업의 성공 여부를 확인해야 합니다.
 * - 작업 상태(jobState) = 3(완료)이고 수집 결과 코드(errorCode) = 1(수집성공)이면
 *   수집 결과 내역 조회(Search) 또는 수집 결과 요약 정보 조회(Summary)를 해야합니다.
 * - 작업 상태(jobState)가 3(완료)이지만 수집 결과 코드(errorCode)가 1(수집성공)이 아닌 경우에는
 *   오류메시지(errorReason)로 수집 실패에 대한 원인을 파악할 수 있습니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetJobState
 */
router.get('/getJobState', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 수집 요청(requestJob API)시 반환반은 작업아이디(jobID)
    var jobID = '021121721000000002';

    htTaxinvoiceService.getJobState(testCorpNum, jobID,
        function(response) {
            res.render('HomeTax/jobState', {
                path: req.path,
                result: response
            })
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 전자세금계산서 매입/매출 내역 수집요청에 대한 상태 목록을 확인합니다.
 * - 수집 요청 후 1시간이 경과한 수집 요청건은 상태정보가 반환되지 않습니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#ListActiveJob
 */
router.get('/listActiveJob', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.listActiveJob(testCorpNum,
        function(response) {
            res.render('HomeTax/listActiveJob', {
                path: req.path,
                result: response
            })
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 수집 상태 확인(GetJobState API) 함수를 통해 상태 정보가 확인된 작업아이디를 활용하여 수집된 전자세금계산서 매입/매출 내역을 조회합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#Search
 */
router.get('/search', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = '';

    // 작업아이디
    var jobID = '021121721000000002';

    // 문서형태 배열 ("N" 와 "M" 중 선택, 다중 선택 가능)
    // └ N = 일반 , M = 수정
    // - 미입력 시 전체조회
    var type = ['N', 'M'];

    // 과세형태 배열 ("T" , "N" , "Z" 중 선택, 다중 선택 가능)
    // └ T = 과세, N = 면세, Z = 영세
    // - 미입력 시 전체조회
    var taxType = ['T', 'N', 'Z'];

    // 발행목적 배열 ("R", "C", "N" 중 선택, 다중 선택 가능)
    // └ R = 영수, C = 청구, N = 없음
    // - 미입력 시 전체조회
    var purposeType = ['R', 'C', 'N'];

    // 종사업장번호의 주체 ("S" , "B" , "T" 중 택 1)
    // - S = 공급자 , B = 공급받는자 , T = 수탁자
    var taxRegIDType = 'S';

    // 종사업장번호 유무 (null , "0" , "1" 중 택 1)
    // - null = 전체조회 , 0 = 없음, 1 = 있음
    var taxRegIDYN = '';

    // 종사업장번호
    // - 다수기재 시 콤마(",")로 구분. ex) "0001,0002"
    // - 미입력 시 전체조회
    var taxRegID = '';


    // 페이지번호
    var page = 1;

    // 페이지당 검색개수
    var perPage = 10;

    // 정렬방향, D-내림차순, A-오름차순
    var order = 'D';

    // 거래처 상호 / 사업자번호 (사업자) / 주민등록번호 (개인) / "9999999999999" (외국인) 중 검색하고자 하는 정보 입력
    // - 사업자번호 / 주민등록번호는 하이픈('-')을 제외한 숫자만 입력
    // - 미입력시 전체조회
    var searchString = '';

    htTaxinvoiceService.search(testCorpNum, jobID, type, taxType, purposeType, taxRegIDType,
        taxRegIDYN, taxRegID, page, perPage, order, testUserID, searchString,
        function(response) {
            res.render('HTTaxinvoice/search', {
                path: req.path,
                result: response
            })
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 수집 상태 확인(GetJobState API) 함수를 통해 상태 정보가 확인된 작업아이디를 활용하여 수집된 전자세금계산서 매입/매출 내역의 요약 정보를 조회합니다.
 * - 요약 정보 : 전자세금계산서 수집 건수, 공급가액 합계, 세액 합계, 합계 금액
 * - https://docs.popbill.com/httaxinvoice/node/api#Summary
 */
router.get('/summary', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = '';

    // 작업아이디
    var jobID = '021103109000000121';

    // 문서형태 배열 ("N" 와 "M" 중 선택, 다중 선택 가능)
    // └ N = 일반 , M = 수정
    // - 미입력 시 전체조회
    var type = ['N', 'M'];

    // 과세형태 배열 ("T" , "N" , "Z" 중 선택, 다중 선택 가능)
    // └ T = 과세, N = 면세, Z = 영세
    // - 미입력 시 전체조회
    var taxType = ['T', 'N', 'Z'];

    // 발행목적 배열 ("R" , "C", "N" 중 선택, 다중 선택 가능)
    // └ R = 영수, C = 청구, N = 없음
    // - 미입력 시 전체조회
    var purposeType = ['R', 'C', 'N'];

    // 종사업장번호의 주체 ("S" , "B" , "T" 중 택 1)
    // - S = 공급자 , B = 공급받는자 , T = 수탁자
    var taxRegIDType = 'S';

    // 종사업장번호 유무 (null , "0" , "1" 중 택 1)
    // - null = 전체조회 , 0 = 없음, 1 = 있음
    var taxRegIDYN = '';

    // 종사업장번호
    // - 다수기재 시 콤마(",")로 구분. ex) "0001,0002"
    // - 미입력 시 전체조회
    var taxRegID = '';

    // 거래처 상호 / 사업자번호 (사업자) / 주민등록번호 (개인) / "9999999999999" (외국인) 중 검색하고자 하는 정보 입력
    // - 사업자번호 / 주민등록번호는 하이픈('-')을 제외한 숫자만 입력
    // - 미입력시 전체조회
    var searchString = '';

    htTaxinvoiceService.summary(testCorpNum, jobID, type, taxType, purposeType,
        taxRegIDType, taxRegIDYN, taxRegID, testUserID, searchString,
        function(response) {
            res.render('HTTaxinvoice/summary', {
                path: req.path,
                result: response
            })
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 국세청 승인번호를 통해 수집한 전자세금계산서 1건의 상세정보를 반환합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetTaxinvoice
 */
router.get('/getTaxinvoice', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 전자세금계산서 국세청 승인번호
    var ntsconfirmNum = '202101074100020300000ecd';

    htTaxinvoiceService.getTaxinvoice(testCorpNum, ntsconfirmNum,
        function(response) {
            res.render('HTTaxinvoice/getTaxinvoice', {
                path: req.path,
                result: response
            })
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 국세청 승인번호를 통해 수집한 전자세금계산서 1건의 상세정보를 XML 형태의 문자열로 반환합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetXML
 */
router.get('/getXML', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 전자세금계산서 국세청 승인번호
    var ntsconfirmNum = '202101074100020300000ecd';

    htTaxinvoiceService.getXML(testCorpNum, ntsconfirmNum,
        function(response) {
            res.render('HTTaxinvoice/getXML', {
                path: req.path,
                result: response
            })
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 수집된 전자세금계산서 1건의 상세내역을 확인하는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetPopUpURL
 */
router.get('/getPopUpURL', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 국세청승인번호
    var NTSConfirmNum = '202101074100020300000ecd';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htTaxinvoiceService.getPopUpURL(testCorpNum, NTSConfirmNum, testUserID,
        function(url) {
            res.render('result', {
                path: req.path,
                result: url
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 수집된 전자세금계산서 1건의 상세내역을 인쇄하는 페이지의 URL을 반환합니다
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetPrintURL
 */
router.get('/getPrintURL', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 국세청승인번호
    var NTSConfirmNum = '202101074100020300000ecd';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htTaxinvoiceService.getPrintURL(testCorpNum, NTSConfirmNum, testUserID,
        function(url) {
            res.render('result', {
                path: req.path,
                result: url
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 홈택스연동 인증정보를 관리하는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetCertificatePopUpURL
 */
router.get('/getCertificatePopUpURL', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htTaxinvoiceService.getCertificatePopUpURL(testCorpNum, testUserID,
        function(url) {
            res.render('result', {
                path: req.path,
                result: url
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 팝빌에 등록된 인증서 만료일자를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetCertificateExpireDate
 */
router.get('/getCertificateExpireDate', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.getCertificateExpireDate(testCorpNum,
        function(expireDate) {
            res.render('result', {
                path: req.path,
                result: expireDate
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 팝빌에 등록된 인증서로 홈택스 로그인 가능 여부를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#CheckCertValidation
 */
router.get('/checkCertValidation', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.checkCertValidation(testCorpNum,
        function(result) {
            res.render('response', {
                path: req.path,
                code: result.code,
                message: result.message
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 홈택스연동 인증을 위해 팝빌에 전자세금계산서용 부서사용자 계정을 등록합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#RegistDeptUser
 */
router.get('/registDeptUser', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 홈택스에서 생성한 전자세금계산서 부서사용자 아이디
    var deptUserID = 'userid';

    // 홈택스에서 생성한 전자세금계산서 부서사용자 비밀번호
    var deptUserPWD = 'passwd';


    htTaxinvoiceService.registDeptUser(testCorpNum, deptUserID, deptUserPWD,
        function(result) {
            res.render('response', {
                path: req.path,
                code: result.code,
                message: result.message
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 홈택스연동 인증을 위해 팝빌에 등록된 전자세금계산서용 부서사용자 계정을 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#CheckDeptUser
 */
router.get('/checkDeptUser', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.checkDeptUser(testCorpNum,
        function(result) {
            res.render('response', {
                path: req.path,
                code: result.code,
                message: result.message
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 팝빌에 등록된 전자세금계산서용 부서사용자 계정 정보로 홈택스 로그인 가능 여부를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#CheckLoginDeptUser
 */
router.get('/checkLoginDeptUser', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.checkLoginDeptUser(testCorpNum,
        function(result) {
            res.render('response', {
                path: req.path,
                code: result.code,
                message: result.message
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 팝빌에 등록된 홈택스 전자세금계산서용 부서사용자 계정을 삭제합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#DeleteDeptUser
 */
router.get('/deleteDeptUser', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.deleteDeptUser(testCorpNum,
        function(result) {
            res.render('response', {
                path: req.path,
                code: result.code,
                message: result.message
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 홈택스연동 정액제 서비스 신청 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetFlatRatePopUpURL
 */
router.get('/getFlatRatePopUpURL', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htTaxinvoiceService.getFlatRatePopUpURL(testCorpNum, testUserID,
        function(url) {
            res.render('result', {
                path: req.path,
                result: url
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 홈택스연동 정액제 서비스 상태를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetFlatRateState
 */
router.get('/getFlatRateState', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.getFlatRateState(testCorpNum,
        function(response) {
            res.render('HomeTax/flatRateState', {
                path: req.path,
                result: response
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 연동회원의 잔여포인트를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetBalance
 */
router.get('/getBalance', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.getBalance(testCorpNum,
        function(remainPoint) {
            res.render('result', {
                path: req.path,
                result: remainPoint
            })
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 연동회원 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetChargeURL
 */
router.get('/getChargeURL', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htTaxinvoiceService.getChargeURL(testCorpNum, testUserID,
        function(url) {
            res.render('result', {
                path: req.path,
                result: url
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 연동회원 포인트 결제내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetPaymentURL
 */
router.get('/getPaymentURL', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htTaxinvoiceService.getPaymentURL(testCorpNum, testUserID,
        function(url) {
            res.render('result', {
                path: req.path,
                result: url
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 연동회원 포인트 사용내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetUseHistoryURL
 */
router.get('/getUseHistoryURL', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htTaxinvoiceService.getUseHistoryURL(testCorpNum, testUserID,
        function(url) {
            res.render('result', {
                path: req.path,
                result: url
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 파트너의 잔여포인트를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetPartnerBalance
 */
router.get('/getPartnerBalance', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.getPartnerBalance(testCorpNum,
        function(remainPoint) {
            res.render('result', {
                path: req.path,
                result: remainPoint
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 파트너 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetPartnerURL
 */
router.get('/getPartnerURL', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // CHRG(포인트충전)
    var TOGO = 'CHRG';

    htTaxinvoiceService.getPartnerURL(testCorpNum, TOGO,
        function(url) {
            res.render('result', {
                path: req.path,
                result: url
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 팝빌 홈택스연동(세금) API 서비스 과금정보를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetChargeInfo
 */
router.get('/getChargeInfo', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.getChargeInfo(testCorpNum,
        function(result) {
            res.render('Base/getChargeInfo', {
                path: req.path,
                result: result
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 사업자번호를 조회하여 연동회원 가입여부를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#CheckIsMember
 */
router.get('/checkIsMember', function(req, res, next) {

    // 조회할 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.checkIsMember(testCorpNum,
        function(result) {
            res.render('response', {
                path: req.path,
                code: result.code,
                message: result.message
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 사용하고자 하는 아이디의 중복여부를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#CheckID
 */
router.get('/checkID', function(req, res, next) {

    // 조회할 아이디
    var testID = 'testkorea';

    htTaxinvoiceService.checkID(testID,
        function(result) {
            res.render('response', {
                path: req.path,
                code: result.code,
                message: result.message
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 사용자를 연동회원으로 가입처리합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#JoinMember
 */
router.get('/joinMember', function(req, res, next) {

    // 회원정보
    var joinInfo = {

        // 회원 아이디 (6자 이상 50자 미만)
        ID: 'userid',

        // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
        Password: 'asdf8536!@#',

        // 링크아이디
        LinkID: htTaxinvoiceService._config.LinkID,

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
        ContactEmail: '',

        // 담당자 연락처 (최대 20자)
        ContactTEL: ''

    };

    htTaxinvoiceService.joinMember(joinInfo,
        function(result) {
            res.render('response', {
                path: req.path,
                code: result.code,
                message: result.message
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 팝빌 사이트에 로그인 상태로 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetAccessURL
 */
router.get('/getAccessURL', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    htTaxinvoiceService.getAccessURL(testCorpNum, testUserID,
        function(url) {
            res.render('result', {
                path: req.path,
                result: url
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 연동회원의 회사정보를 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetCorpInfo
 */
router.get('/getCorpInfo', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    htTaxinvoiceService.getCorpInfo(testCorpNum,
        function(result) {
            res.render('Base/getCorpInfo', {
                path: req.path,
                result: result
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 연동회원의 회사정보를 수정합니다
 * - https://docs.popbill.com/httaxinvoice/node/api#UpdateCorpInfo
 */
router.get('/updateCorpInfo', function(req, res, next) {

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
        function(result) {
            res.render('response', {
                path: req.path,
                code: result.code,
                message: result.message
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 연동회원 사업자번호에 담당자(팝빌 로그인 계정)를 추가합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#RegistContact
 */
router.get('/registContact', function(req, res, next) {

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
        tel: '',

        // 이메일 (최대 100자)
        email: '',

        // 담당자 권한, 1 : 개인권한, 2 : 읽기권한, 3 : 회사권한
        searchRole: 3

    };

    htTaxinvoiceService.registContact(testCorpNum, contactInfo,
        function(result) {
            res.render('response', {
                path: req.path,
                code: result.code,
                message: result.message
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보을 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#GetContactInfo
 */
router.get('/getContactInfo', function(req, res, next) {

    // 팝빌회원 사업자번호
    var testCorpNum = '1234567890';

    // 확인할 담당자 아이디
    var contactID = 'checkContactID';

    htTaxinvoiceService.getContactInfo(testCorpNum, contactID,
        function(result) {
            res.render('Base/getContactInfo', {
                path: req.path,
                result: result
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 목록을 확인합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#ListContact
 */
router.get('/listContact', function(req, res, next) {

    // 조회할 아이디
    var testCorpNum = '1234567890';

    htTaxinvoiceService.listContact(testCorpNum,
        function(result) {
            res.render('Base/listContact', {
                path: req.path,
                result: result
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보를 수정합니다.
 * - https://docs.popbill.com/httaxinvoice/node/api#UpdateContact
 */
router.get('/updateContact', function(req, res, next) {

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
        tel: '',

        // 이메일 (최대 100자)
        email: '',

        // 담당자 권한, 1 : 개인권한, 2 : 읽기권한, 3 : 회사권한
        searchRole: 3

    };

    htTaxinvoiceService.updateContact(testCorpNum, testUserID, contactInfo,
        function(result) {
            res.render('response', {
                path: req.path,
                code: result.code,
                message: result.message
            });
        },
        function(Error) {
            res.render('response', {
                path: req.path,
                code: Error.code,
                message: Error.message
            });
        });
});

module.exports = router;
