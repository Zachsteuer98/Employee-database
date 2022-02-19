INSERT INTO department (name)
VALUES
  ('President'),
  ('Boss Club'),
  ('Marketing'),
  ('Operations'),
  ('Finance'),
  ('Sales'),
  ('HR');

INSERT INTO role (title, salary, department_id)
VALUES
  ('President', 200000, 1),
  ('Big Boss', 100000, 2),
  ('Little Boss', 90000, 2),
  ('Marketing Intern', 50000, 3),
  ('Assembly Line', 40000, 4),
  ('Accountant', 70000, 5),
  ('Sales Representative', 65000, 6),
  ('Human Relations', 70000, 7),
  ('Director of Company Culture', 80000, 7),
  ('Junior Accountant', 40000, 5),
  ('Marketing Manager', 80000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Zachary', 'Steuer', 2, NULL),
  ('Michael', 'Boss', 2, NULL),
  ('Barack', 'Obama', 1, NULL),
  ('Billy', 'Jean', 5, NULL),
  ('Billy', 'the Kid', 4, NULL),
  ('Hannah', 'Montana', 5, NULL),
  ('Rachel', 'Steuer', 4, NULL),
  ('Nathan', 'Arnt', 6, NULL),
  ('Jannis', 'Joplin', 11, NULL),
  ('Michael', 'Jackson', 10, NULL),
  ('Derek', 'Jeter', 8, NULL),
  ('Miley', 'Cyrus', 7, NULL),
  ('Oprah', "Winfrey", 6, NULL),
  ('Seth', 'Rogen', 3, NULL),
  ('Arnold', 'Steuer', 4, NULL),
  ('Sheldon', 'Steuer', 5, NULL),
  ('Andrea', 'Wuchiski', 9, NULL);
