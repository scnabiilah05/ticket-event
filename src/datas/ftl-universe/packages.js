export const packages = [
  {
    id: 1,
    package_name: "ALL CLASSES PASS",
    type_group: 0,
    description: "All Classes Pass description",
    class : 7
  },
  {
    id: 2,
    package_name: "5 CLASSES",
    type_group: 0,
    description: "5 Classes description",
    class : 5
  },
  {
    id: 3,
    package_name: "3 CLASSES",
    type_group: 0,
    description: "3 Classes description",
    class : 3
  },
  {
    id: 4,
    package_name: "1 CLASSES",
    type_group: 0,
    description: "1 Classes description",
    class : 1
  },
  {
    id: 5,
    package_name: "BUNDLING PACKAGE",
    type_group: 0,
    description: "Bundling Package description",
    class : 2
  },
  {
    id: 6,
    package_name: "GROUP OF 5/CLASS",
    type_group: 1,
    description: "Bundling Package description",
    class : 1
  },
  {
    id: 7,
    package_name: "GROUP OF 8/CLASS",
    type_group: 1,
    description: "Bundling Package description",
    class : 1
  },
  
];

export const tickets = [
    {
        id: 1,
        ticket_name: "Presale (member only)",
        package_price : [
            {package_id: 1, price: 1200000},
            {package_id: 2, price: 900000},
            {package_id: 3, price: 550000},
            {package_id: 4, price: 200000},
            {package_id: 5, price: 330000},
            {package_id: 6, price: 900000},
            {package_id: 7, price: 1320000},
        ],
        start_date: "2025-07-01T00:00:00Z",
        end_date: "2025-07-20T23:59:59Z"
    },
    {
        id: 2,
        ticket_name: "General Admission 1",
        package_price : [
            {package_id: 1, price: 1444000},
            {package_id: 2, price: 1080000},
            {package_id: 3, price: 660000},
            {package_id: 4, price: 250000},
            {package_id: 5, price: 430000},
            {package_id: 6, price: 1250000},
            {package_id: 7, price: 1600000},
        ],
        start_date: "2025-07-21T00:00:00Z",
        end_date: "2025-07-31T23:59:59Z"
    },
    {
        id: 3,
        ticket_name: "General Admission 2",
        package_price : [
            {package_id: 1, price: 0},
            {package_id: 2, price: 0},
            {package_id: 3, price: 0},
            {package_id: 4, price: 0},
            {package_id: 5, price: 0},
            {package_id: 6, price: 0},
            {package_id: 7, price: 0},
        ],
        start_date: "2025-08-01T00:00:00Z",
        end_date: "2025-08-31T23:59:59Z"
    }
]


