package com.next.backend.controller;

import com.next.backend.entity.Feedback;
import com.next.backend.repository.FeedbackRepository;
import com.next.backend.service.EmailService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    
    private static final long DUPLICATE_WINDOW_MINUTES = 5;

    private final FeedbackRepository feedbackRepository;
    private final EmailService emailService;

    public FeedbackController(
            FeedbackRepository feedbackRepository,
            EmailService emailService) {

        this.feedbackRepository = feedbackRepository;
        this.emailService = emailService;
    }

   
    private final Object submitLock = new Object();

    @PostMapping
    public ResponseEntity<?> submitFeedback(
            @RequestBody Feedback feedback) {

        synchronized (submitLock) {

            LocalDateTime cutoff =
                    LocalDateTime.now().minusMinutes(DUPLICATE_WINDOW_MINUTES);

            boolean isDuplicate =
                    feedbackRepository.existsSimilarRecent(
                            feedback.getEmail(),
                            feedback.getMessage(),
                            cutoff
                    );

            if (isDuplicate) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("You've already submitted this feedback. Thanks!");
            }

            Feedback saved = feedbackRepository.save(feedback);

            return ResponseEntity.ok(saved);
        }
    }


    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {

        return ResponseEntity.ok(
                feedbackRepository.findAll()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedback(
            @PathVariable Long id) {

        return feedbackRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping("/{id}/reply")
    public ResponseEntity<?> replyToFeedback(
            @PathVariable Long id,
            @RequestBody ReplyRequest request) {

        return feedbackRepository.findById(id)
                .map(feedback -> {

                    feedback.setReply(request.getReply());
                    feedback.setResponded(true);
                    feedbackRepository.save(feedback);

                    
                    emailService.sendReply(
                            feedback.getEmail(),
                            feedback.getName(),
                            request.getReply()
                    );

                    return ResponseEntity.ok(feedback);

                })
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(
            @PathVariable Long id) {

        if (!feedbackRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        feedbackRepository.deleteById(id);

        return ResponseEntity.ok(
                "Feedback deleted successfully"
        );
    }


    public static class ReplyRequest {

        private String reply;

        public String getReply() {
            return reply;
        }

        public void setReply(String reply) {
            this.reply = reply;
        }
    }
}