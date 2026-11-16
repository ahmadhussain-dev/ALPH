
import OrderDetails from "@/components/store/OrderDetails";

export default async function OrderPage({ params }) {
  const { orderId } = await params;

  return <OrderDetails orderId={orderId} />;
}
