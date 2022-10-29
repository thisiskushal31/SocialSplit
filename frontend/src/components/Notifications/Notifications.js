const template = {
  title: "Unmatched Username/Password",
  message: "Uppercase/Lowercase matters.",
  type: "danger",
  insert: "top",
  container: "top-center",
  animationIn: ["animated", "fadeIn"],
  animationOut: ["animated", "fadeOut"],
  dismiss: {
    duration: 3000,
    showIcon: true,
    touch: true,
    pauseOnHover: true,
  }
};

const unmatchedPwd= {
  ...template,
  title: "Passwords Does Not Match",
  message: "Uppercase/Lowercase matters.",
};

const unmatchedMsg = {
  ...template,
  title: "Unmatched Username/Password",
  message: "Uppercase/Lowercase matters.",
};

const emptyField = {
  ...template,
  title: "Fields Cannot be Empty",
  message: "Please Check Carefully.",
};

const success = {
  ...template,
  title: 'Welcome!',
  message: 'Successfully Log in.',
  type: 'success',
}

const m = "Please Check Carefully.";
const invalidField = (msg = m) => {
  if(msg.includes('duplicate')) {
    if(msg.includes('username')) {
      msg = 'Username has been taken.';
    }
    else {
      msg = 'Nickname has been taken.';
    }
  }

  return ({
    ...template,
    title: "Invalid Field",
    message: `Hint: ${msg}`,
  });
};

const invalidRoomName = {
  ...template,
  title: 'No Room Name Provided',
  message: 'Please tell me where you want to go.',
  type: 'warning',
};

export { unmatchedMsg, unmatchedPwd, emptyField, invalidField, invalidRoomName, success };
