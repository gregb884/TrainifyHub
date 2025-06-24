package org.gregb884.statistic.infrastructure.adapter.out.persistence.jparepository;

import org.gregb884.statistic.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {


    boolean existsUserByUsername(String username);

}
