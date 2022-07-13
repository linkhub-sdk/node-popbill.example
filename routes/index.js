/*
 * 팝빌 API Node.js SDK Example
 *
 * Node.js SDK 연동환경 설정방법 안내 : https://docs.popbill.com/taxinvoice/tutorial/node
 * 업데이트 일자 : 2022-07-13
 * 연동기술지원 연락처 : 1600-9854
 * 연동기술지원 이메일 : code@linkhubcorp.com
 *
 * <테스트 연동개발 준비사항>
 * config 폴더에 있는 popbill.js 파일에 선언된 링크아이디(LinkID)와 비밀키(SecretKey)를
 * 링크허브 가입시 메일로 발급받은 인증정보를 참조하여 변경합니다.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', {});
});

module.exports = router;
