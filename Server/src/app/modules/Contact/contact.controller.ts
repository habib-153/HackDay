import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ContactServices } from './contact.service';

const createContact = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await ContactServices.createContact(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Contact added successfully!',
        data: result,
    });
});

const getContacts = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await ContactServices.getContacts(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Contacts retrieved successfully!',
        data: result,
    });
});

const getContactById = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const result = await ContactServices.getContactById(userId, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Contact retrieved successfully!',
        data: result,
    });
});

const updateContact = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const result = await ContactServices.updateContact(userId, id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Contact updated successfully!',
        data: result,
    });
});

const deleteContact = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    await ContactServices.deleteContact(userId, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Contact deleted successfully!',
        data: null,
    });
});

export const ContactControllers = {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact,
};
