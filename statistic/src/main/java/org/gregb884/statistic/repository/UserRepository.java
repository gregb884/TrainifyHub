package org.gregb884.statistic.repository;

import org.gregb884.statistic.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {


    boolean existsUserByUsername(String username);
}
