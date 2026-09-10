package com.next.backend.repository;

import com.next.backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface FeedbackRepository
        extends JpaRepository<Feedback, Long> {

   
    @Query("""
        SELECT COUNT(f) > 0 FROM Feedback f
        WHERE LOWER(TRIM(f.email)) = LOWER(TRIM(:email))
          AND LOWER(TRIM(f.message)) = LOWER(TRIM(:message))
          AND f.createdAt > :after
    """)
    boolean existsSimilarRecent(
            @Param("email") String email,
            @Param("message") String message,
            @Param("after") LocalDateTime after);
}