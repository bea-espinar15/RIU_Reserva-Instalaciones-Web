"use strict"

const university = {
    id: 1,
    name: 'Universidad Complutense de Madrid',
    web: 'https://www.ucm.es/',
    address: 'Av. Complutense, s/n, 28040 Madrid',
    mail: 'ucm.es'
};

const faculties = [
    {
        id: 1,
        name: 'Facultad de Informática',
        idUniversity: 1
    },
    {
        id: 2,
        name: 'Facultad de Derecho',
        idUniversity: 1
    },
    {
        id: 3,
        name: 'Facultad de Medicina',
        idUniversity: 1
    },
    {
        id: 4,
        name: 'Facultad de Bellas Artes',
        idUniversity: 1
    }];

const users = [
    {
        id: 1,
        enabled: 1,
        validated: 1,
        name: 'Beatriz',
        lastname1: 'Espinar',
        lastname2: 'Aragón',
        mail: 'beaesp01',
        password: '1234',
        role: 0,
        idFaculty: 1
    },
    {
        id: 3,
        enabled: 1,
        validated: 1,
        name: 'Jesús',
        lastname1: 'Cáceres',
        lastname2: 'Tello',
        mail: 'jescacer',
        password: '1234',
        role: 1,
        idFaculty: 1
    }];

const facilityTypes = [
    {
        id: 1,
        name: 'Laboratorio',
        idUniversity: 1
    },
    {
        id: 2,
        name: 'Salas LALALA',
        idUniversity: 1
    },
    {
        id: 3,
        name: 'Salas LOLOLO',
        idUniversity: 1
    },
    {
        id: 4,
        name: 'Salas LILILI',
        idUniversity: 1
    }];

const facility = [
    {
        id: 1,
        name: 'Laboratorio 1 - Informática',
        startHour: '09:00',
        endHour: '18:00',
        complete: 0,
        reservationType: 1,
        capacity: 60,
        idType: 1
    },
    {
        id: 2,
        name: 'Laboratorio 2 - Informática',
        startHour: '09:00',
        endHour: '18:00',
        complete: 0,
        reservationType: 1,
        capacity: 60,
        idType: 1
    },
    {
        id: 3,
        name: 'Laboratorio 3 - Informática',
        startHour: '09:00',
        endHour: '18:00',
        complete: 0,
        reservationType: 1,
        capacity: 30,
        idType: 1
    },
    {
        id: 4,
        name: 'Laboratorio 4 - Informática',
        startHour: '09:00',
        endHour: '18:00',
        complete: 0,
        reservationType: 1,
        capacity: 30,
        idType: 1
    }];

const reservations = [
    {
        id: 1,
        enabled: 1,
        idUser: 1,
        idFacility: 18,
        nPeople: 1,
        date: '2023-12-15',
        hour: '09:00:00',
        row: 0,
        reservationDate: '2023-11-26 18:06:23'
    },
    {
        id: 2,
        enabled: 1,
        idUser: 1,
        idFacility: 1,
        nPeople: 15,
        date: '2023-12-20',
        hour: '09:00:00',
        row: 0,
        reservationDate: '2023-11-26 18:06:24'
    },
    {
        id: 3,
        enabled: 1,
        idUser: 1,
        idFacility: 15,
        nPeople: 87,
        date: '2023-12-13',
        hour: '09:00:00',
        row: 0,
        reservationDate: '2023-11-26 18:06:25'
    }];

const oldReservations = [
    {
        id: 1,
        enabled: 1,
        idUser: 1,
        idFacility: 3,
        facilityName: 'Laboratorio 3 - Informática',
        nPeople: 1,
        date: '2023-11-15',
        hour: '09:00:00',
        queued: 0,
        reservationDate: '2023-10-26'
    },
    {
        id: 4,
        enabled: 1,
        idUser: 1,
        idFacility: 4,
        facilityName: 'Laboratorio 4 - Informática',
        nPeople: 1,
        date: '2023-11-15',
        hour: '09:00:00',
        queued: 0,
        reservationDate: '2023-10-26'
    }];

const currentReservations = [
    {
        id: 2,
        enabled: 1,
        idUser: 1,
        idFacility: 1,
        facilityName: 'Laboratorio 1 - Informática',
        nPeople: 15,
        date: '2023-12-20',
        hour: '09:00:00',
        queued: 0,
        reservationDate: '2023-11-26'
    },
    {
        id: 3,
        enabled: 1,
        idUser: 1,
        idFacility: 2,
        facilityName: 'Laboratorio 2 - Informática',
        nPeople: 87,
        date: '2023-12-13',
        hour: '09:00:00',
        queued: 1,
        reservationDate: '2023-11-26'
    }];

const messages = [
    {
        id: 1,
        idSender: 2,
        senderUsername: "jescacer",
        idReceiver: 1,
        receiverUsername: "beaesp01",
        message: 'Hola Beatriz',
        subject: 'Primer mensaje',
        sendDate: '2023-11-25 09:00:00',
        readDate: '2023-11-26 10:10:00'
    },
    {
        id: 2,
        idSender: 2,
        senderUsername: "jescacer",
        idReceiver: 1,
        receiverUsername: "beaesp01",
        message: '¿Qué tal?',
        subject: 'Segundo mensaje',
        sendDate: '2023-11-25 09:00:20',
        readDate: '2023-11-26 10:10:00'
    },
    {
        id: 3,
        idSender: 2,
        senderUsername: "jescacer",
        idReceiver: 1,
        receiverUsername: "beaesp01",
        message: 'Adiós Beatriz',
        subject: 'Tercer mensaje',
        sendDate: '2023-11-25 09:00:40',
        readDate: null
    }];

module.exports = {
    university: university,
    faculties: faculties,
    users: users,
    facilityTypes: facilityTypes,
    facility: facility,
    reservations: reservations,
    oldReservations: oldReservations,
    currentReservations: currentReservations,
    messages: messages
}

/*

CONVENIOS
---------

· ID: <elem>-___
· Idiomas:
    - BBDD [ES]
    - Variables y funciones [EN]
    - IDs y Clases [EN]
    - Texto web [ES]
    - GETs y POSTs [ES]
    - Comentarios [ES]
· Ficheros cliente: snake_case
· Ficheros servidor: UpperCamelCase
· Variables y funciones: lowerCamelCase
· IDs y clases: kebab-case

· Orden estilos CSS:
    1- Display
    2- Margin & Padding
    3- Size
    4- Border
    5- Color

· Orden class en HTML:
    1- Clases propias
    2- Los 5 del anterior

· Orden etiquetas:
    1- ID
    2- Otros
        · <input>: name - type - placeholder - value - min - max
        · <img>: src - alt - width - height
        · <a>: href
    3- class
    4- data

*/