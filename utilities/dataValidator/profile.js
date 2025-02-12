import { validateEmail } from "./auth.js";
import { validateBasicString, validatePhoneNumber } from "./common.js";

const validateProfileData = (userData) => {
    const errors = [];

    if (userData.userEmail && !validateEmail(userData.userEmail)) {
        errors.push("Invalid email address.");
    }

    if (userData.userName && !validateBasicString(userData.userName)) {
        errors.push("Invalid user name.");
    }

    if (userData.rollNumber && !validateBasicString(userData.rollNumber)) {
        errors.push("Invalid roll number.");
    }

    if (userData.phoneNumber && !validatePhoneNumber(userData.phoneNumber)) {
        errors.push("Invalid phone number.");
    }

    if (userData.collegeName && !validateBasicString(userData.collegeName)) {
        errors.push("Invalid college name.");
    }

    if (userData.collegeCity && !validateBasicString(userData.collegeCity)) {
        errors.push("Invalid college city.");
    }

    if (
        userData.userDepartment &&
        !validateBasicString(userData.userDepartment)
    ) {
        errors.push("Invalid user department.");
    }

    if (
        userData.academicYear &&
        (typeof userData.academicYear !== "number" ||
            userData.academicYear <= 0)
    ) {
        errors.push("Invalid academic year. It must be a positive number.");
    }

    if (userData.degree && !validateBasicString(userData.degree)) {
        errors.push("Invalid degree.");
    }

    if (
        userData.needAccommodationDay1 !== undefined &&
        (typeof userData.needAccommodationDay1 !== "number" ||
            ![0, 1].includes(userData.needAccommodationDay1))
    ) {
        errors.push(
            "Invalid value for needAccommodationDay1. It must be 0 or 1.",
        );
    }

    if (
        userData.needAccommodationDay2 !== undefined &&
        (typeof userData.needAccommodationDay2 !== "number" ||
            ![0, 1].includes(userData.needAccommodationDay2))
    ) {
        errors.push(
            "Invalid value for needAccommodationDay2. It must be 0 or 1.",
        );
    }

    if (
        userData.needAccommodationDay3 !== undefined &&
        (typeof userData.needAccommodationDay3 !== "number" ||
            ![0, 1].includes(userData.needAccommodationDay3))
    ) {
        errors.push(
            "Invalid value for needAccommodationDay3. It must be 0 or 1.",
        );
    }

    if (
        userData.isAmrita !== undefined &&
        (typeof userData.isAmrita !== "number" ||
            ![0, 1].includes(userData.isAmrita))
    ) {
        errors.push("Invalid value for isAmrita. It must be 0 or 1.");
    }

    if (
        userData.accountStatus !== undefined &&
        (typeof userData.accountStatus !== "number" ||
            ![0, 1, 2].includes(userData.accountStatus))
    ) {
        errors.push("Invalid value for accountStatus. It must be 0, 1, or 2.");
    }

    return errors.length > 0 ? errors : null;
};

export { validateProfileData };
