const asyncHandler = require("express-async-handler");
const supabase = require("../instance/database");

exports.admin_login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let authQuery = supabase.auth.signInWithPassword({ email, password });

    const authQueryResponse = await authQuery;

    if (authQueryResponse?.data?.user?.id) {
      let sendData = { ...authQueryResponse.data.user };
      delete sendData.error;

      res.status(200).json(sendData);
    } else {
      throw authQueryResponse?.error || authQueryResponse;
    }
  } catch (error) {
    console.error("error -> ", error);
    res
      .status(500)
      .json(error?.message || error || "something went wrong please try again");
  }
});
