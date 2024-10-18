export const isStrongPassword = (password: string) => {
  let regex = new RegExp(
    "^(?=.*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\/\\-])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,20}$"
  );
  return regex.test(password);
};

export const isValidEmail = (email: string) => {
  let regex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
  return regex.test(email);
};
