use relm4::prelude::*;

pub struct LabelEllipsize;

#[relm4::component(pub)]
impl SimpleComponent for LabelEllipsize {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Label {
            set_label: "This is a very long label that should be ellipsized",
            set_ellipsize: gtk::pango::EllipsizeMode::End,
            set_max_width_chars: 15,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
