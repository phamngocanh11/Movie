import React, { useState, useEffect } from "react";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import "./AdminAddForm.css";
import MultiSelect from "../MultiSelect/MultiSelect";

function AdminAddForm({
  id = "admin-form",
  fields = [],
  onSubmit,
  initialValues = {},
  submitButtonText = "Lưu",
  resetAfterSubmit = true,
  className = "",
  cancelButton = false,
  onCancel,
  showSubmitButton = true,
}) {
  const [formData, setFormData] = useState(() => {
    const initialData = { ...initialValues };
    fields.forEach((field) => {
      if (field.type === "multi-select" && !initialData[field.name]) {
        initialData[field.name] = [];
      }
      if (field.value !== undefined && initialData[field.name] === undefined) {
        initialData[field.name] = field.value;
      }
    });
    return initialData;
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      setFormData(prev => {
        const newData = { ...prev };
        Object.keys(initialValues).forEach(key => {
          newData[key] = initialValues[key];
        });
        return newData;
      });
    }
  }, [initialValues]);

  const validateField = (name, value) => {
    const field = fields.find((f) => f.name === name);
    if (!field) return true;

    if (field.required && (value === undefined || value === null || value === "")) {
      return `${field.label} là trường bắt buộc`;
    }

    if (field.validation && value) {
      const validationResult = field.validation(value);
      if (validationResult !== true) {
        return validationResult;
      }
    }

    return true;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach((field) => {
      const validationResult = validateField(field.name, formData[field.name]);
      if (validationResult !== true) {
        newErrors[field.name] = validationResult;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const setFieldValue = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const field = fields.find((f) => f.name === name);
    
    if (type === "file" && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      if (field && field.onChange) {
        field.onChange(e, setFieldValue);
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, type === "file" ? (files.length > 0 ? files[0] : null) : value),
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allTouched = {};
    fields.forEach((field) => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      if (resetAfterSubmit) {
        const resetData = {};
        fields.forEach((field) => {
          if (field.type === "multi-select") {
            resetData[field.name] = [];
          } else {
            resetData[field.name] = "";
          }
        });
        setFormData(resetData);
        setErrors({});
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const {
      type = "text",
      name,
      label,
      placeholder,
      options,
      required,
      col = 12,
      description,
      disabled,
      accept,
      preview,
    } = field;
    const colClass = `form-col-${col}`;
    const error = errors[name] !== true && touched[name] ? errors[name] : null;

    const fieldClasses = `form-group ${colClass} ${error ? "has-error" : ""}`;

    switch (type) {
      case "textarea":
        return (
          <div className={fieldClasses} key={name}>
            <label htmlFor={name}>
              {label}
              {required && <span className="required"></span>}
            </label>
            <textarea
              id={name}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder || ""}
              required={required}
              className={`glass-input ${error ? "error" : ""}`}
              disabled={disabled}
            />
            {description && (
              <div className="field-description">{description}</div>
            )}
            {error && (
              <div className="error-message">{error}</div>
            )}
          </div>
        );

      case "select":
        return (
          <div className={fieldClasses} key={name}>
            <label htmlFor={name}>
              {label}
              {required && <span className="required"></span>}
            </label>
            <select
              id={name}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              required={required}
              className={`glass-input ${error ? "error" : ""}`}
              disabled={disabled}
            >
              <option value="" disabled>
                {placeholder || "Chọn một tùy chọn"}
              </option>
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {description && (
              <div className="field-description">{description}</div>
            )}
            {error && (
              <div className="error-message">{error}</div>
            )}
          </div>
        );

      case "multi-select":
        return (
          <div className={fieldClasses} key={name}>
            <label htmlFor={name}>
              {label}
              {required && <span className="required"></span>}
            </label>
            <MultiSelect
              name={name}
              label={label}
              options={options || []}
              value={formData[name] || []}
              onChange={(e) => {
                handleSelectChange(name, e.target.value);
              }}
              onBlur={handleBlur}
              required={required}
              error={error}
              disabled={disabled}
            />
            {description && (
              <div className="field-description">
                {description} (Giữ Ctrl hoặc Cmd để chọn nhiều)
              </div>
            )}
            {error && (
              <div className="error-message">{error}</div>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className={`${fieldClasses} checkbox-group`} key={name}>
            <div className="checkbox-wrapper glass-checkbox">
              <input
                type="checkbox"
                id={name}
                name={name}
                checked={!!formData[name]}
                onChange={handleChange}
                className={error ? "error" : ""}
                disabled={disabled}
              />
              <label htmlFor={name}>
                {label}
                {required && <span className="required"></span>}
              </label>
            </div>
            {description && (
              <div className="field-description">{description}</div>
            )}
            {error && (
              <div className="error-message">{error}</div>
            )}
          </div>
        );

      case "file":
        return (
          <div className={fieldClasses} key={name}>
            <label htmlFor={name}>
              {label}
              {required && <span className="required"></span>}
            </label>
            <div className="file-input-container">
              <input
                type="file"
                id={name}
                name={name}
                onChange={handleChange}
                onBlur={handleBlur}
                accept={accept}
                className={`glass-file-input ${error ? "error" : ""}`}
                disabled={disabled}
              />
              {preview && (
                <div className="file-preview">
                  {formData[name] instanceof File ? (
                    <img
                      src={URL.createObjectURL(formData[name])}
                      alt="Preview"
                    />
                  ) : preview && typeof preview === 'string' ? (
                    <img
                      src={preview}
                      alt="Current file"
                    />
                  ) : null}
                </div>
              )}
            </div>
            {description && (
              <div className="field-description">{description}</div>
            )}
            {error && (
              <div className="error-message">{error}</div>
            )}
          </div>
        );
      default:
        return (
          <div className={fieldClasses} key={name}>
            <Input
              type={type}
              id={name}
              name={name}
              label={label + (required ? " " : "")}
              placeholder={placeholder || ""}
              value={formData[name] || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              required={required}
              error={error}
              disabled={disabled}
            />
          </div>
        );
    }
  };

  return (
    <form
      id={id}
      className={`admin-add-form glass-form ${className}`}
      onSubmit={handleSubmit}
    >
      <div className="form-row">{fields.map(renderField)}</div>
      <div className="form-actions">
        {cancelButton && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Hủy
          </Button>
        )}
        {showSubmitButton && (
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            hasIcon={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : submitButtonText}
          </Button>
        )}
      </div>
    </form>
  );
}

export default AdminAddForm;
