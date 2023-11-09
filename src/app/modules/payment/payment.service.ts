import { Payment, PaymentStatus, Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import prisma from "../../../shared/prisma";
import { sslService } from "../ssl/ssl.service";
import { paymentSearchableFields } from "./payment.constant";

const initPyament=async (data:any)=>{
    const paymentSession=await sslService.initPyament({

        total_amount: data.amount,
        tran_id: data.transaction_id, // use unique tran_id for each api call
        cus_name: data.name,
        cus_email: data.email,
        cus_add1: data.address,
        cus_phone: data.phone,

    })

    await prisma.payment.create({
        data:{
            amount:data.amount,
            transactionId:data.transaction_id,
            userEmail:data.email
        }
    })
    return paymentSession.redirectGatewayURL
}


const webhook = async (payload: any) => {
    if (!payload || !payload?.status || payload?.status !== 'VALID') {
        return {
            massage: 'Invalid Payment!'
        }
    }
    const result = await sslService.validate(payload);

    if (result?.status !== 'VALID') {
        return {
            massage: 'Payment failed'
        }
    }

    const { tran_id } = result;
    await prisma.payment.updateMany({
        where: {
            transactionId: tran_id
        },
        data: {
            status: PaymentStatus.PAID,
            paymentGatewayData: payload
        }
    })

    return {
        massage: 'Payment Success'
    };
}
const getAllFromDB = async (
    filters: any,
    options: any
): Promise<IGenericResponse<Payment[]>> => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: paymentSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        });
    }

    const whereConditions: Prisma.PaymentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.payment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc'
                }
    });
    const total = await prisma.payment.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
};

const getByIdFromDB = async (id: string): Promise<Payment | null> => {
    const result = await prisma.payment.findUnique({
        where: {
            id
        }
    });
    return result;
};
export const PaymentService={
    initPyament,webhook,getByIdFromDB,getAllFromDB
    
}