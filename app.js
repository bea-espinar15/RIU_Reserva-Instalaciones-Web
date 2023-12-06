const university = [{
    id: 1,
    name: 'Universidad Complutense de Madrid',
    web: 'https://www.ucm.es/',
    address: 'Av. Complutense, s/n, 28040 Madrid',
    mail: 'ucm.es'
}];

const faculties = [{
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

const users = [{
    id: 1,
    enabled: 1,
    validated: 1,
    name: 'Beatriz',
    lastname1: 'Espinar',
    lastname2: 'Aragón',
    mail: 'beaesp01@ucm.es',
    password: '1234',
    role: 0,
    idFaculty: 1
},
{
    id: 2,
    enabled: 1,
    validated: 1,
    name: 'Lucas',
    lastname1: 'Bravo',
    lastname2: 'Fairen',
    mail: 'lucbravo@ucm.es',
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
    mail: 'jescacer@ucm.es',
    password: '1234',
    role: 1,
    idFaculty: 1
}];

const facilityType = [{
    id: 1,
    name: 'Laboratorio',
    idUniversity: 1
},
{
    id: 2,
    name: 'Salas de grados',
    idUniversity: 1
},
{
    id: 3,
    name: 'Salón de actos',
    idUniversity: 1
},
{
    id: 4,
    name: 'Salas de reunión',
    idUniversity: 1
},
{
    id: 5,
    name: 'Sala de estudio',
    idUniversity: 1
}];

const facility = [{
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
},
{
    id: 5,
    name: 'Salas de grados 1 - Informática',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 1,
    capacity: 120,
    idType: 2
},
{
    id: 6,
    name: 'Salas de grados 2 - Informática',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 1,
    capacity: 120,
    idType: 2
},
{
    id: 7,
    name: 'Salas de grados 3 - Informática',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 1,
    capacity: 90,
    idType: 2
},
{
    id: 8,
    name: 'Salas de grados 1 - Derecho',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 1,
    capacity: 90,
    idType: 2
},
{
    id: 9,
    name: 'Salas de grados 2 - Derecho',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 1,
    capacity: 80,
    idType: 2
},
{
    id: 10,
    name: 'Salas de grados 3 - Derecho',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 1,
    capacity: 80,
    idType: 2
},
{
    id: 11,
    name: 'Salón de actos 1 - Informática',
    startHour: '09:00',
    endHour: '18:00',
    complete: 1,
    reservationType: 1,
    capacity: 250,
    idType: 3
},
{
    id: 12,
    name: 'Salón de actos 1 - Medicina',
    startHour: '09:00',
    endHour: '18:00',
    complete: 1,
    reservationType: 1,
    capacity: 250,
    idType: 3
},
{
    id: 13,
    name: 'Salas de reunión 1 - Informática',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 1,
    capacity: 10,
    idType: 4
},
{
    id: 14,
    name: 'Salas de reunión 2 - Informática',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 1,
    capacity: 10,
    idType: 4
},
{
    id: 15,
    name: 'Salas de reunión 1 - Derecho',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 1,
    capacity: 8,
    idType: 4
},
{
    id: 16,
    name: 'Salas de reunión 1 - Medicina',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 1,
    capacity: 5,
    idType: 4
},
{
    id: 17,
    name: 'Salas de reunión 1 - Bellas Artes',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 1,
    capacity: 5,
    idType: 4
},
{
    id: 18,
    name: 'Sala de estudio 1 - Informática',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 0,
    capacity: 1,
    idType: 5
},
{
    id: 19,
    name: 'Sala de estudio 2 - Informática',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 0,
    capacity: 1,
    idType: 5
},
{
    id: 20,
    name: 'Sala de estudio 1 - Medicina',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 0,
    capacity: 1,
    idType: 5
},
{
    id: 21,
    name: 'Sala de estudio 1 - Bellas Artes',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 0,
    capacity: 1,
    idType: 5
},
{
    id: 22,
    name: 'Sala de estudio 1 - Bellas Artes',
    startHour: '09:00',
    endHour: '18:00',
    complete: 0,
    reservationType: 0,
    capacity: 1,
    idType: 5
}];

const reservations = [{
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
},
{
    id: 4,
    enabled: 1,
    idUser: 2,
    idFacility: 18,
    nPeople: 1,
    date: '2023-12-15',
    hour: '09:00:00',
    row: 1,
    reservationDate: '2023-11-26 18:06:26'
},
{
    id: 5,
    enabled: 1,
    idUser: 2,
    idFacility: 11,
    nPeople: 220,
    date: '2023-12-15',
    hour: '09:00:00',
    row: 0,
    reservationDate: '2023-11-26 18:06:27'
},
{
    id: 6,
    enabled: 1,
    idUser: 2,
    idFacility: 5,
    nPeople: 1,
    date: '2023-12-14',
    hour: '09:00:00',
    row: 0,
    reservationDate: '2023-11-26 18:06:28'
}];

const messages = [{
    id: 1,
    idSender: 1,
    idReceiver: 2,
    message: 'Hola Beatriz',
    subject: 'Segundo mensaje',
    sendDate: '2023-11-25 18:06:23',
    readDate: '2023-11-26 18:06:23'
},
{
    id: 2,
    idSender: 1,
    idReceiver: 3,
    message: 'Hola Jesús',
    subject: 'Primer mensaje',
    sendDate: '2023-11-25 10:10:10',
    readDate: '2023-11-26 10:10:10'
},
{
    id: 3,
    idSender: 2,
    idReceiver: 1,
    message: 'Adiós Lucas',
    subject: 'Primera respuesta',
    sendDate: '2023-11-26 23:18:06',
    readDate: '2023-11-27 23:18:06'
},
{
    id: 4,
    idSender: 2,
    idReceiver: 3,
    message: 'Hola Jesús',
    subject: 'Primer mensaje',
    sendDate: '2023-11-26 10:10:10',
    readDate: '2023-11-26 10:11:11'
},
{
    id: 5,
    idSender: 3,
    idReceiver: 1,
    message: 'Adiós Lucas',
    subject: 'Primera respuesta',
    sendDate: '2023-11-26 10:10:30',
    readDate: '2023-11-27 10:10:10'
},
{
    id: 6,
    idSender: 3,
    idReceiver: 2,
    message: 'Adiós Beatriz',
    subject: 'Segunda respuesta',
    sendDate: '2023-11-26 10:11:31',
    readDate: '2023-11-27 10:10:10'
},
{
    id: 7,
    idSender: 3,
    idReceiver: 1,
    message: 'Hola a todos',
    subject: 'Primer mensaje',
    sendDate: '2023-11-28 09:00:00',
    readDate: null
},
{
    id: 8,
    idSender: 3,
    idReceiver: 2,
    message: 'Hola a todos',
    subject: 'Segundo mensaje',
    sendDate: '2023-11-28 09:00:00',
    readDate: null
},];