package database

type Student struct {
	ID          int     `json:"id"`
	StudentName string  `json:"student_name"`
	Address     string  `json:"address"`
	Mark        float64 `json:"mark"`
}

func GetAllStudents() ([]Student, error) {
	query := `
        SELECT id, student_name, address, mark 
        FROM students 
        ORDER BY id
    `
	rows, err := DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var students []Student
	for rows.Next() {
		var s Student
		err := rows.Scan(&s.ID, &s.StudentName, &s.Address, &s.Mark)
		if err != nil {
			return nil, err
		}
		students = append(students, s)
	}
	return students, nil
}
