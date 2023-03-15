const orderStatusEnum = Object.freeze({
  FILLED: 1,
  REJECTED: 2,
  PENDING: 3,
  CANCELED: 4,
  IN_TRANSIT: 5,
  DELIVERED: 6,
});

const paymentMethod = Object.freeze({
  KAKAO_PAY: "카카오 페이",
  CREDIT_CARD: "신용카드",
  NAVER_PAY: "네이버 페이",
  PAYCO: "페이코",
  TRANSFER: "계좌 이체",
});

module.exports = {
  orderStatusEnum,
  paymentMethod,
};
