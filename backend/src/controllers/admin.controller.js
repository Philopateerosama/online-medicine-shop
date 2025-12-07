import { prisma } from '../config/prisma.js';
import ExcelJS from 'exceljs';

export async function addProduct(req, res, next) {
    try {
        const { name, description, price, stockQuantity, imageUrl, category } = req.body;
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                stockQuantity: parseInt(stockQuantity),
                imageUrl,
                category
            }
        });
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
}

export async function updateProduct(req, res, next) {
    try {
        const { id } = req.params;
        const { name, description, price, stockQuantity, imageUrl, category } = req.body;

        const data = {};
        if (name !== undefined) data.name = name;
        if (description !== undefined) data.description = description;
        if (price !== undefined) data.price = parseFloat(price);
        if (stockQuantity !== undefined) data.stockQuantity = parseInt(stockQuantity);
        if (imageUrl !== undefined) data.imageUrl = imageUrl;
        if (category !== undefined) data.category = category;

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data
        });
        res.json(product);
    } catch (err) {
        next(err);
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const { id } = req.params;
        await prisma.product.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        next(err);
    }
}

export async function exportUsers(req, res, next) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true, // "Name" in requirements, but schema has username
                email: true,
                phone: true,
                role: true,
                address: true
                // Exclude passwordHash
            }
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'username', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Role', key: 'role', width: 10 },
            { header: 'Address', key: 'address', width: 30 }
        ];

        worksheet.addRows(users);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        next(err);
    }
}
