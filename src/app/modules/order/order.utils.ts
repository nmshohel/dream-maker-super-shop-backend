import prisma from "../../../shared/prisma";

// Student ID
export const findLastOrderId = async (): Promise<string | undefined> => {
    const lastOrder = await prisma.order.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        orderId: true,
      },
    });
    return lastOrder?.orderId || undefined;
  };
  
  export const generateOrderId = async (): Promise<string> => {

    const lastOrderId = await findLastOrderId();
    const currentId = lastOrderId ? lastOrderId : "10000000";
    console.log("currentId",currentId)
    let incrementedId = (parseInt(currentId) + 1);
    return incrementedId.toString();
  };