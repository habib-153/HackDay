import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TContact } from './contact.interface';
import { Contact } from './contact.model';
import { User } from '../User/user.model';

const createContact = async (userId: string, payload: Partial<TContact>) => {
    // Check if contact user exists
    const contactUser = await User.findById(payload.contactUserId);
    if (!contactUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // Check if already a contact
    const existingContact = await Contact.findOne({
        userId,
        contactUserId: payload.contactUserId,
    });

    if (existingContact) {
        throw new AppError(httpStatus.CONFLICT, 'Contact already exists!');
    }

    // Cannot add yourself as contact
    if (userId === payload.contactUserId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Cannot add yourself as contact!');
    }

    const contact = await Contact.create({
        ...payload,
        userId,
    });

    return contact;
};

const getContacts = async (userId: string) => {
    const contacts = await Contact.find({ userId, isBlocked: false })
        .populate('contactUserId', 'name email')
        .sort({ createdAt: -1 });

    return contacts;
};

const getContactById = async (userId: string, contactId: string) => {
    const contact = await Contact.findOne({ _id: contactId, userId }).populate(
        'contactUserId',
        'name email',
    );

    if (!contact) {
        throw new AppError(httpStatus.NOT_FOUND, 'Contact not found!');
    }

    return contact;
};

const updateContact = async (
    userId: string,
    contactId: string,
    payload: Partial<TContact>,
) => {
    const contact = await Contact.findOneAndUpdate(
        { _id: contactId, userId },
        payload,
        { new: true, runValidators: true },
    );

    if (!contact) {
        throw new AppError(httpStatus.NOT_FOUND, 'Contact not found!');
    }

    return contact;
};

const deleteContact = async (userId: string, contactId: string) => {
    const contact = await Contact.findOneAndDelete({ _id: contactId, userId });

    if (!contact) {
        throw new AppError(httpStatus.NOT_FOUND, 'Contact not found!');
    }

    return contact;
};

export const ContactServices = {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact,
};
