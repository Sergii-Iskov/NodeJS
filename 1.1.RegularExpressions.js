let Validator = {
  validateEmail: function (str) {
    let regexp =
      /^[\a-z0-9][-a-z0-9\.\+]{1,19}@[-a-z0-9\.\+\!\$\%\&\'\*\/\=\?\^\_]{1,15}\.[a-z]{1,5}$/gi;
    // ----------firstpart----------@--------------------secondpart------------.------end------
    return regexp.test(str);
  },
  validatePhone: function (str) {
    if (str.length <= 25) {
      str = str.replace(/[-+\s]/g, ""); // clean phone number from "-", "+", " "
      if (str.length >= 10) {
        let regexp = /^[\d]{0,2}((\(\d{3}\))\d{7}|\d{10})$/gi;
        //            --38--?---(--000--)0000000 | 0000000000
        // console.log(str + " = " + str.match(regexp));      // for test
        return regexp.test(str);
      }
    }
    return false;
  },
  validatePassword: function (str) {
    let regexp = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[_0-9a-zA-Z]{8,}/g;
    return regexp.test(str);
  },
};

//                    validate email
// console.log("---------------valid email---------------");
// console.log(
//   Validator.validateEmail("fi@secondpart.end") + "   fi@secondpart.end"
// );
// console.log(
//   Validator.validateEmail("first-part@.se=cond%p.art.end") +
//     "   first-part@.se=cond%p.art.end"
// );
// console.log(
//   Validator.validateEmail("first.part@se=cond%part.r") +
//     "   first.part@se=cond%part.r"
// );

// console.log("---------------nonvalid email--------------");
// console.log(Validator.validateEmail("f@secondart.end") + "   f@secondart.end");
// console.log(
//   Validator.validateEmail("first-part@.se=cond@part.end") +
//     "   first-part@.se=cond@part.end"
// );
// console.log(
//   "first-part@.se=cond@part.end".match(
//     /[\a-z0-9][-a-z0-9\.\+]{1,19}@[-a-z0-9\.\+\!\$\%\&\'\*\/\=\?\^\_]{1,15}\.[a-z]{1,5}$/gi
//   )
// );
// console.log(
//   Validator.validateEmail("-firstpart@.se=cond%.enddeded") +
//     "   -firstpart@.se=cond%.enddeded"
// );
// console.log(
//   Validator.validateEmail("firs_tpart@.se.en") + "   firs_tpart@.se.en"
// );
// console.log(
//   Validator.validateEmail("firstpart@.se.enddeded") +
//     "   firstpart@.se.enddeded"
// );

//                    validate phone
// console.log("-------------valid Phone--------------");
// console.log(
//   Validator.validatePhone("+38 (099) 567 8901") + "   +38 (099) 567 8901"
// );
// console.log(
//   Validator.validatePhone("+38 099 5 6 7 8 9  01") + "   +38 099 5 6 7 8 9  01"
// );
// console.log(
//   Validator.validatePhone("(09-9) 567-890-1") + "   (09-9) 567-890-1"
// );
// console.log(
//   Validator.validatePhone("--  (099) 567 890-1") + "   --  (099) 567 890-1"
// );
// console.log("-------------nonvalid email-----------");
// console.log(
//   Validator.validatePhone("+38 (099) 567 8901 0") + "   +38 (099) 567 8901 0"
// );
// console.log(
//   Validator.validatePhone("+38 099 a0000000") + "   +38 099 a0000000"
// );
// console.log(
//   Validator.validatePhone("+48 (0989) 567 8901") + "   +48 (0989) 567 8901"
// );
// console.log(
//   Validator.validatePhone("+38 (0989) 567 8901") + "   +38 (0989) 567 8901"
// );

//                    validate Password
// console.log("---------------valid Password---------------");
// console.log(Validator.validatePassword("C00l_Pass") + "   C00l_Pass");
// console.log(Validator.validatePassword("SupperPas1") + "   SupperPas1");
// console.log("---------------nonvalid Password--------------");
// console.log(Validator.validatePassword("Cool_pass") + "   Cool_pass");
// console.log(Validator.validatePassword("C00l") + "   C00l");
