import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  studentid: {
    type: String,
  },
  examination_fee: {
    type: String,
  },

  transport_fee: {
    type: String,
  },
  tuition_fee: {
    type: String,
  },
  deposited_date: {
    type: String,
  },
  paid_month: {
    type: String,
  },
  paid_amount: {
    type: String,
  },
  due: {
    type: String,
  },
  payment_status: {
    type: String,
  },
});

const fee = mongoose.model("fee", feeSchema, "fees");

export default fee;
