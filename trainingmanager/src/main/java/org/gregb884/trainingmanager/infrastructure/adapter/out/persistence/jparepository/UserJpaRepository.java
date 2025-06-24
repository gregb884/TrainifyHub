package org.gregb884.trainingmanager.infrastructure.adapter.out.persistence.jparepository;

import org.gregb884.trainingmanager.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserJpaRepository extends JpaRepository<User, Long> {


    Boolean existsUserByUsername(String username);

    User findByUsername(String username);

}
