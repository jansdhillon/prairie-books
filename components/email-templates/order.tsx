import { OrderItemInsertType, OrderItemType } from "@/lib/types/types";
import { Eye } from "lucide-react";
import * as React from "react";


interface OrderConfirmationTemplateProps {
  orderId: string;
  orderItems: OrderItemInsertType[];
  totalAmount: string;
}

export const OrderConfirmationTemplate: React.FC<
  OrderConfirmationTemplateProps
> = ({ orderId, orderItems, totalAmount }) => (
  <div
    style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6, color: "#333" }}
  >
    <h1
      style={{
        color: "#4a5568",
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: "10px",
      }}
    >
      Order Confirmation
    </h1>
    <p>Hello,</p>
    <p>
      Thank you for your purchase! We have received your order. Here are the
      details:
    </p>
    <div
      style={{
        background: "#f7fafc",
        padding: "15px",
        borderRadius: "5px",
        marginBottom: "20px",
      }}
    >
      <p>
        <strong>Order ID:</strong> {orderId}
      </p>
      <div>
        <table>
          <th>
            <tr>
              <th>Book</th>
              <th>Title</th>
              <th>Author</th>


              <th>Price</th>
            </tr>
          </th>
          <tbody>
            {orderItems?.map((item: OrderItemInsertType) => (
              <tr key={item.id}>
                {item?.image_directory && (
                  <td>
                    <img
                      src={`${item?.image_directory}image-1.png`}
                      alt={item.book_title || ""}
                      width={50}
                      height={50}
                    />
                  </td>
                )}
                <td>{item?.book_title}</td>

                <td>${item?.price.toFixed(2)}</td>
              </tr>
            ))}

          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right font-bold">
                Total:
              </td>
              <td className="font-bold">${totalAmount} CAD</td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
    <p>You will receive another email when your items have been shipped.</p>
    <div
      style={{
        marginTop: "30px",
        borderTop: "1px solid #e2e8f0",
        paddingTop: "10px",
        fontSize: "0.9em",
        color: "#718096",
      }}
    >
      <p>This email was sent for your order at Kathrin's Books.</p>
    </div>
  </div>
);
