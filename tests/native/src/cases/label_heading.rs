use gtk::prelude::*;
use relm4::prelude::*;

pub struct LabelHeading;

#[relm4::component(pub)]
impl SimpleComponent for LabelHeading {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Label {
            set_label: "Label",
            add_css_class: "heading",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
