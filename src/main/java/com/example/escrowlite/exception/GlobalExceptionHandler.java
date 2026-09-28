package com.example.escrowlite.exception;
import com.example.escrowlite.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse err = new ErrorResponse();
        err.timestamp = LocalDateTime.now().toString();
        err.status = HttpStatus.NOT_FOUND.value();
        err.error = "Not Found";
        err.message = ex.getMessage();
        return err;
    }

    @ExceptionHandler(BusinessRuleException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBusinessRule(BusinessRuleException ex) {
        ErrorResponse err = new ErrorResponse();
        err.timestamp = LocalDateTime.now().toString();
        err.status = HttpStatus.BAD_REQUEST.value();
        err.error = "Business Rule Violation";
        err.message = ex.getMessage();
        return err;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(MethodArgumentNotValidException ex) {
        ErrorResponse err = new ErrorResponse();
        err.timestamp = LocalDateTime.now().toString();
        err.status = HttpStatus.BAD_REQUEST.value();
        err.error = "Validation Error";
        err.message = ex.getBindingResult().getFieldError().getDefaultMessage();
        return err;
    }
}